import { useLanguage } from "@/components/language-provider";
import { Trophy } from "lucide-react";

export function AwardsGrid() {
    const { t } = useLanguage();

    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.dashboard?.awards?.title || "Your Hall of Fame"}</h2>
            <p className="text-muted-foreground mb-8">{t.dashboard?.awards?.subtitle || "Earn badges for completed lessons and games!"}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                    { name: t.dashboard?.awards?.mock?.start || "Quick Start", desc: t.dashboard?.awards?.mock?.startDesc || "Completed first lesson" },
                    { name: t.dashboard?.awards?.mock?.vocab || "Vocab Master", desc: t.dashboard?.awards?.mock?.vocabDesc || "100% in quiz" },
                    { name: t.dashboard?.awards?.mock?.steady || "Systematic", desc: t.dashboard?.awards?.mock?.steadyDesc || "Logged in 7 days" },
                    { name: t.dashboard?.awards?.mock?.polyglot || "Polyglot", desc: t.dashboard?.awards?.mock?.polyglotDesc || "Passed A1 level" }
                ].map((award, i) => (
                    <div key={i} className="flex flex-col items-center p-4 border rounded-xl bg-white hover:bg-slate-50">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-sm text-slate-800">{award.name}</p>
                        <p className="text-xs text-muted-foreground text-center mt-1">{award.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
