import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-9xl font-black tracking-tighter italic text-gray-100 absolute -z-10 select-none">404</h1>
            <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Lost in the Loop?</h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm font-medium">
                    The page you are looking for doesn't exist or has been moved. Let's get you back to the collection.
                </p>
                <div className="pt-6">
                    <Button asChild className="bg-black text-white rounded-none h-14 px-12 font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95">
                        <Link href="/shop">Back to Shop</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
