'use client';

import { useState } from 'react';
import { Upload, FileText, Trash2, Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadResume, deleteResume, getResumeUrl } from './upload-actions';

interface ResumeUploadProps {
    initialResumeUrl?: string | null;
}

export default function ResumeUpload({ initialResumeUrl }: ResumeUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
    const [isDragging, setIsDragging] = useState(false);

    async function handleUpload(file: File) {
        setIsUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('resume', file);

        const result = await uploadResume(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
            setResumeUrl(result.url);
        }

        setIsUploading(false);
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete your resume?')) {
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
            setMessage({ type: 'error', text: 'Please drop a PDF file' });
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Resume / CV</h3>

            {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span className="text-sm">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="text-current hover:opacity-70">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {resumeUrl ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <FileText className="h-8 w-8 text-teal-600" />
                        <div className="flex-1">
                            <p className="font-medium text-slate-900">resume.pdf</p>
                            <p className="text-sm text-slate-600">Your current resume</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="flex-1"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            disabled={isDeleting}
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
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
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-300 hover:border-teal-400'
                            }`}
                    >
                        <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-teal-600' : 'text-slate-400'}`} />
                        <p className="text-sm font-medium text-slate-900 mb-1">
                            {isDragging ? 'Drop your PDF here' : 'Upload your resume'}
                        </p>
                        <p className="text-xs text-slate-600 mb-4">
                            Drag and drop or click to browse (PDF only, max 5MB)
                        </p>

                        <label htmlFor="resume-upload">
                            <Button
                                type="button"
                                disabled={isUploading}
                                className="bg-teal-600 hover:bg-teal-700"
                                onClick={() => document.getElementById('resume-upload')?.click()}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose File
                                    </>
                                )}
                            </Button>
                        </label>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
