"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { UploadCloud, Trash2, Link as LinkIcon, FileText, Image as ImageIcon, File } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

import { MOCK_FILES, FileItem, formatFileSize } from "@/lib/files-store";
import { GoogleDrivePicker } from "@/components/admin/google-drive-picker";
import { getProducts } from "@/lib/product-service";

export default function MaterialsPage() {
    const { t } = useLanguage();
    const m = t.adminPanel?.materials || {};
    const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedProductSlug, setSelectedProductSlug] = useState<string>("");

    const products = getProducts(); // In a real app, this would be fetched from API/DB

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const uploadedFiles: FileItem[] = newFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type || 'unknown',
            uploadedAt: new Date().toISOString(),
            source: 'upload'
        }));

        setFiles(prev => [...uploadedFiles, ...prev]);
        toast.success(m.toasts?.uploadSuccess?.replace("{count}", uploadedFiles.length.toString()) || "Uploaded");
    };

    const handleGoogleImport = (importedFiles: Partial<FileItem>[]) => {
        const newFiles: FileItem[] = importedFiles.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            name: f.name || 'Unknown',
            size: f.size || 0,
            type: f.type || 'unknown',
            uploadedAt: new Date().toISOString(),
            source: 'google-drive',
            ...f
        } as FileItem));

        setFiles(prev => [...newFiles, ...prev]);
    };

    const handleDelete = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setSelectedFiles(prev => prev.filter(fid => fid !== id));
        toast.success(m.toasts.deleted);
    };

    const toggleSelectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(files.map(f => f.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const assignFilesToProduct = () => {
        if (!selectedProductSlug) return;

        setFiles(prev => prev.map(f => {
            if (selectedFiles.includes(f.id)) {
                return { ...f, assignedProductId: selectedProductSlug };
            }
            return f;
        }));

        toast.success(m.toasts.assigned.replace("{count}", selectedFiles.length.toString()));
        setAssignDialogOpen(false);
        setSelectedFiles([]);
        setSelectedProductSlug("");
    };

    const getProductTitle = (slug?: string) => {
        if (!slug) return null;
        return products.find(p => p.slug === slug)?.title || slug;
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{m.title || "Materials"}</h2>
                    <p className="text-muted-foreground">{m.subtitle}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="destructive" disabled={selectedFiles.length === 0} onClick={() => {
                        setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
                        setSelectedFiles([]);
                        toast.success(m.toasts.deletedSelected);
                    }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {m.deleteSelected.replace("{count}", selectedFiles.length.toString())}
                    </Button>

                    <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} disabled={selectedFiles.length === 0}>
                                <LinkIcon className="h-4 w-4 mr-2" />
                                {m.assignToProduct.replace("{count}", selectedFiles.length.toString())}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{m.dialog.title}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <label className="text-sm font-medium mb-2 block">{m.dialog.selectLabel}</label>
                                <Select value={selectedProductSlug} onValueChange={setSelectedProductSlug}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={m.dialog.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <ScrollArea className="h-[300px]">
                                            {products.map(p => (
                                                <SelectItem key={p.slug} value={p.slug}>
                                                    {p.title.substring(0, 50)}{p.title.length > 50 ? '...' : ''}
                                                </SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>{m.dialog.cancel}</Button>
                                <Button onClick={assignFilesToProduct} disabled={!selectedProductSlug}>{m.dialog.save}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Zone */}
                <Card className="lg:col-span-3">
                    <CardContent className="pt-6">
                        <div
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{m.dragDrop}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{m.clickToUpload}</p>

                            <div className="flex justify-center gap-4">
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileInput}
                                    />
                                    <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")}>{m.selectFiles}</Button>
                                </div>
                                <span className="flex items-center text-sm text-muted-foreground">{m.or}</span>
                                <GoogleDrivePicker onImport={handleGoogleImport} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Files List */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{m.library.title.replace("{count}", files.length.toString())}</CardTitle>
                        <CardDescription>{m.library.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedFiles.length === files.length && files.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>{m.table.fileName}</TableHead>
                                    <TableHead>{m.table.size}</TableHead>
                                    <TableHead>{m.table.source}</TableHead>
                                    <TableHead>{m.table.product}</TableHead>
                                    <TableHead className="text-right">{m.table.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {m.library.empty}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    files.map(file => (
                                        <TableRow key={file.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedFiles.includes(file.id)}
                                                    onCheckedChange={() => toggleSelect(file.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {file.type.includes('image') ? <ImageIcon className="h-4 w-4 text-blue-500" /> :
                                                        file.type.includes('pdf') ? <FileText className="h-4 w-4 text-red-500" /> :
                                                            <File className="h-4 w-4 text-gray-500" />}
                                                    <span className="font-medium">{file.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatFileSize(file.size)}</TableCell>
                                            <TableCell>
                                                {file.source === 'google-drive' ? (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{m.badges.drive}</Badge>
                                                ) : (
                                                    <Badge variant="secondary">{m.badges.upload}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {file.assignedProductId ? (
                                                    <Badge variant="default" className="max-w-[200px] truncate block">
                                                        {getProductTitle(file.assignedProductId)}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm italic">{m.badges.unassigned}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
