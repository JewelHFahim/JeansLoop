import { Suspense } from 'react';
import { ShopClient } from './ShopClient';
import { Loader } from '@/components/ui/loader';

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader variant="page" text="SYNCHRONIZING_COLLECTION" />
            </div>
        }>
            <ShopClient />
        </Suspense>
    );
}
