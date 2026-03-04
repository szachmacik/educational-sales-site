"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { login } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const language = (params?.lang as string) || "pl";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password, "admin", null);

      if (result && result.user.role === "admin") {
        // Set cookie for middleware
        document.cookie = `user_token=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        localStorage.setItem("user_token", result.token);
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("auth_user", JSON.stringify(result.user));

        // Redirect to admin panel
        router.push(`/${language}/admin`);
      } else if (result) {
        setError("To konto nie ma uprawnień administratora.");
      } else {
        setError("Nieprawidłowy email lub hasło.");
      }
    } catch {
      setError("Błąd serwera. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

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
                autoComplete="email"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500"
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
                  autoComplete="current-password"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 pr-10"
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

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
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
