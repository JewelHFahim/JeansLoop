'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/cart';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="bg-white min-h-screen py-24 lg:py-40">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block border-2 border-black p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-black mb-6">
                            Bag Is Empty
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">
                            You have no items in your collection yet.
                        </p>
                        <Link href="/shop">
                            <Button className="h-14 rounded-none bg-black text-white font-black uppercase tracking-widest text-xs px-10 hover:scale-105 transition-all">
                                Return To Store
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="border-b-2 border-black pb-8 mb-12">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-black">
                        Shopping Bag
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">
                        Review Your Selection / {items.length} {items.length === 1 ? 'Item' : 'Items'} Ready
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.variantSku} className="group border border-gray-100 bg-white p-6 transition-all hover:border-black hover:shadow-xl">
                                    <div className="flex gap-8">
                                        <div className="h-32 w-32 flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between py-1">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.variantSku}</p>
                                                <h3 className="text-lg font-black uppercase tracking-tight text-black">{item.name}</h3>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">
                                                    Size: {item.size} / Color: {item.color}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6 mt-4">
                                                <div className="flex items-center border-2 border-black bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, Math.max(1, item.quantity - 1))}
                                                        className="w-10 h-10 flex items-center justify-center font-black text-lg hover:bg-gray-100 transition-colors text-black"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 h-10 flex items-center justify-center font-black text-sm bg-black text-white border-x-2 border-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center font-black text-lg hover:bg-gray-100 transition-colors text-black"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.variantSku)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-start pt-1">
                                            <p className="text-xl font-black text-black">৳{(item.price * item.quantity).toFixed(0)}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">৳{item.price.toFixed(0)} / Unit</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Link href="/shop" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:gap-5 transition-all">
                                <span className="text-lg">←</span> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="border-2 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter border-b-2 border-black pb-4 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-black text-sm">৳{getTotalPrice().toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-black text-sm">৳100</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Vat (Inclusive)</span>
                                    <span className="text-black text-sm">৳0</span>
                                </div>

                                <div className="border-t-2 border-black pt-6 mt-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</p>
                                            <p className="text-3xl font-black tracking-tighter text-black leading-none mt-1">
                                                ৳{(getTotalPrice() + 100).toFixed(0)}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-black uppercase bg-black text-white px-2 py-1">
                                            BDT
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="mt-10 w-full h-16 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all group shadow-xl">
                                    Proceed To Checkout
                                    <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                                </Button>
                            </Link>

                            <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                                <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                    Secure SSL Encrypted Checkout
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                    Eligible for 7-day easy returns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
