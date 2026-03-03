"use client";

import { Bell, CheckCircle2, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function InAppNotifications() {
    const [hasUnread, setHasUnread] = useState(true);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-colors hover:bg-secondary"
                    aria-label="Notifications"
                    onClick={() => setHasUnread(false)}
                >
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 mt-2">
                <DropdownMenuLabel className="p-3 bg-secondary/30">Powiadomienia</DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <DropdownMenuGroup className="max-h-[300px] overflow-auto">
                    <DropdownMenuItem className="flex flex-col items-start gap-1.5 p-3 cursor-pointer focus:bg-secondary">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">Nowy Speakbook!</span>
                            <span className="text-xs text-muted-foreground">2 godz. temu</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Speakbook: My Australia Day jest już dostępny w przedsprzedaży. Zobacz szczegóły!
                        </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0" />
                    <DropdownMenuItem className="flex flex-col items-start gap-1.5 p-3 cursor-pointer focus:bg-secondary">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">Aktualizacja pakietu</span>
                            <span className="text-xs text-muted-foreground">1 dzień temu</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Dodano nowe materiały do pakietu Jesień. Pobierz odświeżony plik ZIP z zakładki Moje Materiały.
                        </p>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2">
                    <Button onClick={() => toast.success(t?.common?.success || "Akcja wykonana pomyślnie.")} variant="ghost" className="w-full justify-center text-xs font-semibold text-indigo-600 h-8">
                        Oznacz wszystkie jako przeczytane
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
