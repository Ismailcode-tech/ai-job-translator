'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, Download, Loader2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadResume, deleteResume, getResumeUrl } from './upload-actions';
import { useTranslations } from 'next-intl';

interface ResumeUploadProps {
    initialResumeUrl?: string | null;
}

export default function ResumeUpload({ initialResumeUrl }: ResumeUploadProps) {
    const t = useTranslations('profile.resumeSection');
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
    const [isDragging, setIsDragging] = useState(false);

    async function handleUpload(file: File) {
        // Client-side validation
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: t('fileSizeError') });
            return;
        }

        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: t('fileTypeError') });
            return;
        }

        setIsUploading(true);
        setMessage(null);

        try {
            console.log('[Client] Creating FormData with file:', file.name, file.size);
            const formData = new FormData();
            formData.append('resume', file);

            console.log('[Client] Calling uploadResume server action...');
            const result = await uploadResume(formData);
            console.log('[Client] Server action returned:', result);

            if (result.error) {
                console.error('[Client] Upload error:', result.error);
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                console.log('[Client] Upload success:', result.success);
                setMessage({ type: 'success', text: result.success });
                setResumeUrl(result.url);

                // Force page refresh to show updated skills in the form
                console.log('[Client] Refreshing page to show new skills...');
                router.refresh();
            }
        } catch (error: any) {
            console.error('[Client] Upload failed with exception:', error);
            setMessage({
                type: 'error',
                text: error.message || t('uploadError', { default: 'An unexpected error occurred.' })
            });
        } finally {
            console.log('[Client] Upload process complete, resetting loading state');
            setIsUploading(false);
        }
    }

    async function handleDelete() {
        if (!confirm(t('deleteConfirm'))) {
            return;
        }

        setIsDeleting(true);
        setMessage(null);

        const result = await deleteResume();

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
            setResumeUrl(null);
        }

        setIsDeleting(false);
    }

    async function handleDownload() {
        const signedUrl = await getResumeUrl();
        if (signedUrl) {
            window.open(signedUrl, '_blank');
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf') {
            handleUpload(file);
        } else {
            setMessage({ type: 'error', text: t('dropError') });
        }
    }

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{t('title')}</h3>
                    <p className="text-sm text-slate-500">{t('subtitle')}</p>
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <span className="text-sm font-medium">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="text-current hover:opacity-70 p-1">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {resumeUrl ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-5 bg-teal-50/50 border border-teal-100 rounded-xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-teal-50/0 group-hover:bg-teal-50/50 transition-colors" />
                        <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 z-10">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 z-10">
                            <p className="font-bold text-slate-900">{t('current')}</p>
                            <p className="text-sm text-slate-500">resume.pdf • {t('ready')}</p>
                        </div>
                        <div className="z-10">
                            <CheckCircle className="h-6 w-6 text-teal-500" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="flex-1 h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {t('download')}
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            disabled={isDeleting}
                            className="flex-1 h-11 border-red-100 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('deleting')}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('remove')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`group relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${isDragging
                            ? 'border-teal-500 bg-teal-50 scale-[1.01]'
                            : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/50'
                            }`}
                    >
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />

                        <div className="relative z-10">
                            <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500'
                                }`}>
                                <Upload className="h-8 w-8" />
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 mb-2">
                                {isDragging ? t('dropTitle') : t('uploadTitle')}
                            </h4>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                <span className="font-semibold text-teal-600 cursor-pointer hover:underline" onClick={() => document.getElementById('resume-upload')?.click()}>{t('browse')}</span> {t('dragText')}.
                            </p>

                            <p className="text-xs text-slate-400 font-medium">
                                {t('format')}
                            </p>
                        </div>

                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm rounded-xl">
                                <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-3" />
                                <p className="font-bold text-slate-900">{t('uploading')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
