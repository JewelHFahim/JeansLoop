'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(8);

    useEffect(() => {
        if (countdown === 0) {
            router.push('/account');
            return;
        }
        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown, router]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-16">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Animated Checkmark */}
                <div className="relative mx-auto w-28 h-28">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                    <div className="relative flex items-center justify-center w-full h-full bg-green-500 rounded-full border-4 border-white shadow-2xl">
                        <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Order Confirmed</p>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black leading-none">Thank You!</h1>
                    <p className="text-gray-600 font-medium leading-relaxed text-sm">
                        Your order has been received and is being prepared.<br />
                        We'll contact you shortly to confirm delivery.
                    </p>
                </div>

                {/* What Happens Next */}
                <div className="bg-gray-50 border border-gray-100 p-6 text-left space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">What Happens Next</p>
                    {[
                        { icon: Package, step: '1', text: 'We confirm your order & prepare it for shipping' },
                        { icon: ArrowRight, step: '2', text: 'Our team contacts you within 24 hours' },
                        { icon: CheckCircle, step: '3', text: 'Delivery within 2–3 days after confirmation' },
                    ].map(({ icon: Icon, step, text }) => (
                        <div key={step} className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                                {step}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{text}</p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid gap-3">
                    <Link href="/account">
                        <Button className="w-full bg-black text-white rounded-none font-black uppercase tracking-widest text-xs h-14 group hover:bg-gray-900 transition-all">
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

                {/* Auto-redirect */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Redirecting to your orders in {countdown}s...
                </p>
            </div>
        </div>
    );
}
