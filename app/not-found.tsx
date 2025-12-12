import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
            <p className="text-muted-foreground mb-8">Could not find the requested resource.</p>
            <Link href="/" className="px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-primary/90 transition-colors">
                Return Home
            </Link>
        </div>
    );
}
