"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Folder, FileText, Image as ImageIcon } from "lucide-react";
import { FileItem } from "@/lib/files-store";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

interface GoogleDrivePickerProps {
    onImport: (files: Partial<FileItem>[]) => void;
}

const MOCK_DRIVE_FILES = [
    { id: 'gd-1', name: 'KamilaEnglish_Materials', type: 'folder' },
    { id: 'gd-2', name: 'September_2025.pdf', type: 'application/pdf', size: 2500000 },
    { id: 'gd-3', name: 'Autumn_Worksheets.pdf', type: 'application/pdf', size: 1800000 },
    { id: 'gd-4', name: 'Audio_MP3_Pack.zip', type: 'application/zip', size: 45000000 },
    { id: 'gd-5', name: 'Ebook_Cover.png', type: 'image/png', size: 350000 },
];

export function GoogleDrivePicker({ onImport }: GoogleDrivePickerProps) {
    const { t } = useLanguage();
    const g = t?.adminSettings?.google?.drive || {
        button: "Download from Google Drive",
        connecting: "Connecting...",
        picker_title: "Select files from Google Drive",
        import_count: "Import selected ({count})",
        toast_success: "Imported {count} files from Google Drive"
    };

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleConnect = () => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            setIsOpen(true);
        }, 1500);
    };

    const toggleFile = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleImport = () => {
        const filesToImport = MOCK_DRIVE_FILES
            .filter(f => selectedFiles.includes(f.id) && f.type !== 'folder')
            .map(f => ({
                name: f.name,
                size: f.size,
                type: f.type,
                source: 'google-drive' as const
            }));

        onImport(filesToImport);
        setIsOpen(false);
        setSelectedFiles([]);
        toast.success(g.toast_success.replace("{count}", filesToImport.length.toString()));
    };

    return (
        <>
            <Button variant="outline" onClick={handleConnect} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path d="M12.01 1.485c-2.082 3.583-4.163 7.167-6.245 10.75 2.158 3.57 4.315 7.142 6.472 10.712 1.996-3.468 3.992-6.937 5.986-10.407-2.072-3.685-4.143-7.37-6.213-11.055zM6.666 11.235 2.333 18.78h.04c1.642 2.67 3.284 5.34 4.926 8.01h9.324c-1.92-3.328-3.838-6.657-5.756-9.986H6.666zm6.817 11.554h8.312c1.782-3.085 3.563-6.17 5.344-9.255-1.908-3.322-3.816-6.645-5.724-9.968l-4.132 7.147-3.799 6.618 4.195 7.218z" fill="currentColor" />
                        <path d="M12.01 1.485v.024l6.096 10.596-.036.012-4.195-7.217-1.865-3.415zm-5.344 9.75h4.247L4.996 23.493l-2.663-4.327c-.015-.027-.03-.053-.046-.08.016-.025.032-.05.047-.076l4.332-7.525z" fill="currentColor" />
                    </svg>
                )}
                {isLoading ? g.connecting : g.button}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{g.picker_title}</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="h-[300px] border rounded-md p-2">
                        <div className="space-y-1">
                            {MOCK_DRIVE_FILES.map((file) => (
                                <div
                                    key={file.id}
                                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedFiles.includes(file.id) ? 'bg-primary/10' : 'hover:bg-muted'
                                        }`}
                                    onClick={() => file.type !== 'folder' && toggleFile(file.id)}
                                >
                                    <div className="mr-3">
                                        {file.type === 'folder' ? <Folder className="h-5 w-5 text-yellow-500" /> :
                                            file.type.includes('image') ? <ImageIcon className="h-5 w-5 text-blue-500" /> :
                                                <FileText className="h-5 w-5 text-red-500" />}
                                    </div>
                                    <div className="flex-1 text-sm font-medium truncate">
                                        {file.name}
                                    </div>
                                    {selectedFiles.includes(file.id) && (
                                        <div className="h-2 w-2 rounded-full bg-primary ml-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>{t?.adminPanel?.materials?.dialog?.cancel || "Cancel"}</Button>
                        <Button onClick={handleImport} disabled={selectedFiles.length === 0}>
                            {g.import_count.replace("{count}", selectedFiles.length.toString())}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
