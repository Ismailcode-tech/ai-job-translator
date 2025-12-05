'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => null,
    }
);

interface PDFDownloadWrapperProps {
    document: any;
    fileName: string;
    className?: string;
    children: React.ReactNode;
}

export default function PDFDownloadWrapper({ document, fileName, className, children }: PDFDownloadWrapperProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button className={className} disabled>
                {children}
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={document}
            fileName={fileName}
            className={className}
        >
            {/* @ts-ignore - The render props signature is complex, simplified for wrapper */}
            {({ blob, url, loading, error }) =>
                loading ? 'Generating...' : children
            }
        </PDFDownloadLink>
    );
}
