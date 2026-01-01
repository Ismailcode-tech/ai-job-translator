import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
            <div className="mb-8 p-6 bg-white rounded-full shadow-xl shadow-slate-200">
                <ShieldAlert className="h-16 w-16 text-rose-500" />
            </div>

            <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lost in the Mediator Space?</h2>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                The resource you are looking for has been moved or doesn't exist in our decision engine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                    <Button variant="default" className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                        <Home className="mr-2 h-5 w-5" /> Back to Control Room
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">
                        Return Home
                    </Button>
                </Link>
            </div>

            <div className="mt-16 text-sm text-slate-400">
                <p>&copy; {new Date().getFullYear()} MEDYX Mediator Platform</p>
            </div>
        </div>
    );
}
