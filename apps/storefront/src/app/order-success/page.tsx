'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20" />
                    <div className="relative flex items-center justify-center w-full h-full bg-black rounded-full border-4 border-white shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Order Received!</h1>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Your elite gear is being prepared. We've sent a confirmation email with details of your order.
                    </p>
                </div>

                <div className="pt-8 grid gap-4">
                    <Link href="/account">
                        <Button className="w-full bg-black text-white rounded-none font-black uppercase tracking-widest text-xs h-14 group">
                            View Order History
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline" className="w-full border-black text-black rounded-none font-black uppercase tracking-widest text-xs h-14 hover:bg-black hover:text-white transition-all">
                            Continue Shopping
                            <ShoppingBag className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="pt-12 border-t border-gray-100 italic">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Supreme Quality Guaranteed</p>
                </div>
            </div>
        </div>
    );
}
