export interface FileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
    source: 'upload' | 'google-drive';
    assignedProductId?: string;
}

export const MOCK_FILES: FileItem[] = [
    { id: '1', name: 'Scenariusze_Wrzesien_Pack.pdf', size: 1024 * 1024 * 5, type: 'application/pdf', uploadedAt: '2026-02-01T10:00:00Z', source: 'upload', assignedProductId: '1' },
    { id: '2', name: 'Flashcards_Animals.zip', size: 1024 * 1024 * 15, type: 'application/zip', uploadedAt: '2026-02-01T11:30:00Z', source: 'google-drive', assignedProductId: 'mega-pack-2w1' },
];

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
