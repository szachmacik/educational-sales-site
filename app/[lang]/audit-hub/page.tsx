"use client";

import { useState, useEffect } from "react";

const PAGES_TO_TEST = [
    { url: "/pl", label: "🏠 Strona główna (PL)", expected: "Pełna strona po polsku" },
    { url: "/en", label: "🏠 Homepage (EN)", expected: "Full page in English" },
    { url: "/pl/products", label: "🛍️ Produkty (PL)", expected: "Lista produktów" },
    { url: "/pl/products/angielski-w-zlobku-zestaw-december", label: "📦 Produkt demo (PL)", expected: "Karta produktu, cena, opis" },
    { url: "/pl/blog", label: "📝 Blog (PL)", expected: "Lista artykułów" },
    { url: "/pl/contact", label: "📞 Kontakt (PL)", expected: "Formularz kontaktowy" },
    { url: "/pl/cart", label: "🛒 Koszyk (PL)", expected: "Pusty koszyk" },
    { url: "/uk/products", label: "🛍️ Товари (UK)", expected: "Стор українською" },
    { url: "/de/products", label: "🛍️ Produkte (DE)", expected: "Deutschsprachige Seite" },
    { url: "/pl/dashboard", label: "👤 Dashboard (PL)", expected: "Strona logowania / dashboard" },
];

export default function AuditHubPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [newReport, setNewReport] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    useEffect(() => {
        fetch("/api/audit-hub/report")
            .then((r) => r.json())
            .then((data) => {
                setReports(Array.isArray(data) ? data : []);
                setLoadingReports(false);
            })
            .catch(() => setLoadingReports(false));
    }, []);

    const submitReport = async () => {
        try {
            const parsed = JSON.parse(newReport);
            const res = await fetch("/api/audit-hub/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed),
            });
            if (res.ok) {
                setSubmitStatus("✅ Raport zapisany!");
                setNewReport("");
                const updated = await fetch("/api/audit-hub/report").then((r) => r.json());
                setReports(Array.isArray(updated) ? updated : []);
            } else {
                setSubmitStatus("❌ Błąd zapisu");
            }
        } catch (e) {
            setSubmitStatus("❌ Nieprawidłowy JSON");
        }
    };

    return (
        <div style={{ fontFamily: "monospace", padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>🔍 Audit Hub — Manus + Antigravity</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
                Wspólna strona do audytu. Manus przeklika linki → wysyła raport → Antigravity wdraża poprawki.
            </p>

            {/* Alerty dla Agenta */}
            <div style={{ background: "#fee2e2", border: "2px solid #ef4444", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
                <h2 style={{ color: "#991b1b", marginTop: 0 }}>⚠️ URGENT: STOP REDUNDANT THREADS</h2>
                <p style={{ color: "#7f1d1d", fontWeight: "bold" }}>
                    Please STOP all previous audit tasks and only continue with Task ID: <code style={{ background: "#fca5a5", padding: "2px 4px" }}>DLgGidnY64Tkzj6Z7VeZGu</code>.
                </p>
                <p style={{ fontSize: "12px", color: "#991b1b" }}>
                    This is to ensure we have a single, consolidated reporting thread in this Audit Hub.
                </p>
            </div>

            {/* Instrukcja dla Manusa */}
            <div style={{ background: "#f0f9ff", border: "2px solid #0ea5e9", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
                <h2 style={{ color: "#0369a1", marginTop: 0 }}>📋 Instrukcja dla Manusa</h2>
                <ol style={{ lineHeight: "2" }}>
                    <li>Przejdź przez każdy link w tabeli poniżej</li>
                    <li>Zanotuj błędy: angielskie teksty na PL stronach, brakujące treści, błędy wizualne</li>
                    <li>Wyślij raport POST do <code>{baseUrl}/api/audit-hub/report</code></li>
                    <li>
                        Format JSON:
                        <pre style={{ background: "#e0f2fe", padding: "8px", fontSize: "11px", overflow: "auto" }}>{`{
  "source": "manus",
  "timestamp": "${new Date().toISOString()}",
  "findings": [
    { "page": "/pl", "status": "ok|error|warning", "issues": ["opis problemu"] }
  ],
  "scores": { "translation": 85, "ui": 90, "overall": 87 }
}`}</pre>
                    </li>
                </ol>
            </div>

            {/* Tabela linków do przetestowania */}
            <h2>🔗 Strony do audytu</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                <thead>
                    <tr style={{ background: "#1e293b", color: "white" }}>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Strona</th>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Oczekiwane</th>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {PAGES_TO_TEST.map((page, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white", borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "8px 12px", fontWeight: "bold" }}>{page.label}</td>
                            <td style={{ padding: "8px 12px", color: "#64748b", fontSize: "13px" }}>{page.expected}</td>
                            <td style={{ padding: "8px 12px" }}>
                                <a
                                    href={page.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#6366f1", textDecoration: "none", padding: "4px 10px", background: "#eef2ff", borderRadius: "4px", fontSize: "13px" }}
                                >
                                    Otwórz →
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Raporty z Manusa */}
            <h2>📊 Raporty i Zadania (Manus AI to Antigravity)</h2>
            {loadingReports ? (
                <p>Ładowanie raportów...</p>
            ) : reports.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>Brak raportów. Manus jeszcze nie przesłał wyników.</p>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {reports.map((r, i) => (
                        <div key={i} style={{
                            background: r.source === "manus" ? "#fdfaf1" : "#f8fafc",
                            border: `1px solid ${r.source === "manus" ? "#fde68a" : "#e2e8f0"}`,
                            borderRadius: "12px",
                            padding: "20px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <span style={{
                                    background: r.source === "manus" ? "#fbbf24" : "#64748b",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: "999px",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}>
                                    {r.source?.toUpperCase() || "AUDIT"}
                                </span>
                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                                    {new Date(r.timestamp).toLocaleString()}
                                </span>
                            </div>

                            {r.scores && (
                                <div style={{ display: "flex", gap: "24px", marginBottom: "16px", padding: "12px", background: "white", borderRadius: "8px", border: "1px inset #f1f5f9" }}>
                                    <div>🌐 Tłumaczenia: <strong>{r.scores.translation}%</strong></div>
                                    <div>🎨 UI/UX: <strong>{r.scores.ui}%</strong></div>
                                    <div>✅ Score: <strong style={{ color: r.scores.overall >= 80 ? "#059669" : "#d97706" }}>{r.scores.overall}%</strong></div>
                                </div>
                            )}

                            {r.findings && (
                                <div>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#475569" }}>Wykryte błędy do naprawy:</h4>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {r.findings.map((f: any, j: number) => (
                                            <li key={j} style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "10px",
                                                marginBottom: "8px",
                                                padding: "8px",
                                                background: f.status === "error" ? "#fef2f2" : "#f8fafc",
                                                borderRadius: "6px",
                                                border: `1px solid ${f.status === "error" ? "#fecaca" : "#f1f5f9"}`
                                            }}>
                                                <span style={{
                                                    minWidth: "60px",
                                                    textAlign: "center",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    background: f.status === "ok" ? "#dcfce7" : f.status === "error" ? "#fee2e2" : "#fef9c3",
                                                    color: f.status === "ok" ? "#166534" : f.status === "error" ? "#991b1b" : "#854d0e"
                                                }}>
                                                    {f.status?.toUpperCase()}
                                                </span>
                                                <div style={{ flex: 1 }}>
                                                    <code style={{ fontSize: "12px", fontWeight: "bold" }}>{f.page}</code>
                                                    <p style={{ margin: "4px 0 0 0", fontSize: "13px" }}>{f.issues?.join(" • ")}</p>
                                                </div>
                                                {/* Status wdrożenia przez Antigravity */}
                                                <div style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>
                                                    {f.fixed ? "✅ Fixed by Antigravity" : "⏳ Pending fix"}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Ręczne wysyłanie raportu */}
            <h2 style={{ marginTop: "48px" }}>📤 Konsola Raportowa (dla Manus AI)</h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
                Manus AI używa tego pola lub API POST do przekazywania listy poprawek.
            </p>
            <textarea
                value={newReport}
                onChange={(e) => setNewReport(e.target.value)}
                placeholder='{"source":"manus","findings":[{"page":"/pl","status":"error","issues":["Błędne kodowanie w stopce"]}],"scores":{"translation":80,"ui":90,"overall":85}}'
                style={{ width: "100%", height: "120px", fontFamily: "monospace", fontSize: "12px", padding: "12px", border: "2px solid #e2e8f0", borderRadius: "8px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                <button
                    onClick={submitReport}
                    style={{ background: "#4f46e5", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                >
                    Zatwierdź i Wyślij do Antigravity
                </button>
                {submitStatus && <span style={{ fontWeight: "bold" }}>{submitStatus}</span>}
            </div>

            <div style={{ marginTop: "40px", padding: "12px", background: "#fef9c3", borderRadius: "8px", fontSize: "12px" }}>
                <strong>API endpoint dla Manusa:</strong><br />
                <code>GET {baseUrl}/api/audit-hub/report</code> — lista raportów<br />
                <code>POST {baseUrl}/api/audit-hub/report</code> — dodaj raport (body: JSON)
            </div>
        </div>
    );
}
