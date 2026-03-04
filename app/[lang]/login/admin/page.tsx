"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle, Clock, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 20; // must match server-side limit for admin

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const language = (params?.lang as string) || "pl";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error / rate-limit state
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer when blocked
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            setIsBlocked(false);
            setError(null);
            setRemainingAttempts(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        // Rate limited
        const secs = data.retryAfterSecs ?? 60;
        setIsBlocked(true);
        setCountdown(secs);
        setError(data.message ?? `Zbyt wiele prób. Poczekaj ${secs} sekund.`);
        setRemainingAttempts(0);
        return;
      }

      if (!res.ok || !data.success) {
        // Wrong credentials — show remaining attempts
        const remaining = typeof data.remainingAttempts === "number" ? data.remainingAttempts : null;
        setRemainingAttempts(remaining);

        if (remaining !== null && remaining <= 3 && remaining > 0) {
          setError(`Nieprawidłowy email lub hasło. Pozostało ${remaining} ${remaining === 1 ? "próba" : remaining < 5 ? "próby" : "prób"}.`);
        } else if (remaining === 0) {
          setError("Zbyt wiele nieudanych prób. Poczekaj chwilę przed kolejną próbą.");
        } else {
          setError(data.message ?? "Nieprawidłowy email lub hasło.");
        }
        return;
      }

      // Success
      if (data.user?.role === "admin") {
        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `user_token=${data.token}; path=/; max-age=${maxAge}; SameSite=Strict`;
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        router.push(`/${language}/admin`);
      } else {
        setError("To konto nie ma uprawnień administratora.");
      }
    } catch {
      setError("Błąd serwera. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const attemptsLeft = remainingAttempts ?? MAX_ATTEMPTS;
  const attemptsPercent = Math.max(0, (attemptsLeft / MAX_ATTEMPTS) * 100);
  const showAttemptsBar = remainingAttempts !== null && remainingAttempts < MAX_ATTEMPTS;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/80 backdrop-blur shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30">
            <ShieldCheck className="h-7 w-7 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Panel Administratora</CardTitle>
          <CardDescription className="text-slate-400">
            Zaloguj się aby uzyskać dostęp do panelu zarządzania
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email administratora</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kamila.ofshore.dev"
                required
                disabled={isBlocked}
                autoComplete="email"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isBlocked}
                  autoComplete="current-password"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 pr-10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border ${
                isBlocked
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {isBlocked
                  ? <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                  : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                }
                <span>{error}</span>
              </div>
            )}

            {/* Countdown timer when blocked */}
            {isBlocked && countdown > 0 && (
              <div className="rounded-lg bg-slate-700/50 border border-slate-600 px-3 py-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Dostęp tymczasowo zablokowany
                  </span>
                  <span className="font-mono text-orange-400 font-bold">{countdown}s</span>
                </div>
                <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 60) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Możesz spróbować ponownie za {countdown} {countdown === 1 ? "sekundę" : countdown < 5 ? "sekundy" : "sekund"}.</p>
              </div>
            )}

            {/* Remaining attempts bar (shows when < MAX attempts used) */}
            {showAttemptsBar && !isBlocked && (
              <div className="rounded-lg bg-slate-700/50 border border-slate-600 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pozostałe próby logowania</span>
                  <span className={`font-bold ${attemptsLeft <= 5 ? "text-red-400" : attemptsLeft <= 10 ? "text-yellow-400" : "text-slate-300"}`}>
                    {attemptsLeft} / {MAX_ATTEMPTS}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      attemptsLeft <= 5 ? "bg-red-500" : attemptsLeft <= 10 ? "bg-yellow-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${attemptsPercent}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isBlocked}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : isBlocked ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Poczekaj {countdown}s...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Zaloguj jako Admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a
              href={`/${language}/login`}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              ← Wróć do logowania klientów
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
