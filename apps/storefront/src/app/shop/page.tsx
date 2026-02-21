import { Suspense } from 'react';
import { ShopClient } from './ShopClient';

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-40">
                        <div className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                            Loading Shop...
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ShopClient />
        </Suspense>
    );
}
