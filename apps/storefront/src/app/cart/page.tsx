'use client';

import { Button } from '@/components/ui/button';
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
                <div className="border-b-2 border-black pb-6 sm:pb-8 mb-8 sm:mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none text-black">
                        Shopping Bag
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 sm:mt-4">
                        Review Your Selection / {items.length} {items.length === 1 ? 'Item' : 'Items'} Ready
                    </p>
                </div>

                <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4 sm:space-y-6">
                            {items.map((item) => (
                                <div key={item.variantSku} className="group border border-gray-100 bg-white p-4 sm:p-6 transition-all hover:border-black hover:shadow-xl">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">

                                        {/* Top Section / Image & Details */}
                                        <div className="flex gap-4 sm:gap-8 min-w-0">
                                            <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                                                <div>
                                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{item.variantSku}</p>
                                                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black leading-tight line-clamp-2">{item.name}</h3>
                                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 truncate">
                                                        Size: {item.size} / Color: {item.color}
                                                    </p>
                                                </div>

                                                {/* Mobile Price */}
                                                <div className="sm:hidden mt-2">
                                                    <p className="text-lg font-black text-black">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">৳{item.price.toFixed(0)} / Unit</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">

                                            {/* Desktop Price */}
                                            <div className="hidden sm:flex flex-col items-end justify-start pt-1">
                                                <p className="text-xl font-black text-black">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">৳{item.price.toFixed(0)} / Unit</p>
                                            </div>

                                            <div className="flex items-center gap-4 sm:gap-6 sm:mt-4 w-full sm:w-auto justify-between sm:justify-end">
                                                <div className="flex items-center border-2 border-black bg-white h-9 sm:h-10">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                        className="w-8 sm:w-10 h-full flex items-center justify-center font-black text-lg hover:bg-gray-100 transition-colors text-black"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 sm:w-12 h-full flex items-center justify-center font-black text-sm bg-black text-white border-x-2 border-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, item.size, item.color, item.quantity + 1)}
                                                        className="w-8 sm:w-10 h-full flex items-center justify-center font-black text-lg hover:bg-gray-100 transition-colors text-black"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.variantSku, item.size, item.color)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                                                >
                                                    <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 sm:mt-12 text-center sm:text-left">
                            <Link href="/shop" className="inline-flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:gap-5 transition-all bg-gray-50 sm:bg-transparent px-6 py-4 sm:p-0 w-full sm:w-auto border sm:border-0 border-gray-200">
                                <span className="text-lg">←</span> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit mt-6 lg:mt-0">
                        <div className="border-2 border-black p-5 sm:p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-full overflow-hidden">
                            <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter border-b-2 border-black pb-4 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span className="truncate">Subtotal</span>
                                    <span className="text-black text-sm whitespace-nowrap">৳{getTotalPrice().toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span className="truncate">Shipping</span>
                                    <span className="text-black text-sm whitespace-nowrap">৳70–৳140</span>
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Exact shipping at checkout (by district)</p>
                                <div className="flex justify-between items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-500">
                                    <span className="truncate">Vat (Inclusive)</span>
                                    <span className="text-black text-sm whitespace-nowrap">৳0</span>
                                </div>

                                <div className="border-t-2 border-black pt-5 sm:pt-6 mt-5 sm:mt-6">
                                    <div className="flex justify-between items-end gap-2">
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">Subtotal</p>
                                            <p className="text-2xl sm:text-3xl font-black tracking-tighter text-black leading-none mt-1 truncate">
                                                ৳{getTotalPrice().toFixed(0)}
                                            </p>
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase bg-black text-white px-2 py-1 whitespace-nowrap">
                                            BDT
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="mt-8 sm:mt-10 w-full h-14 sm:h-16 rounded-none bg-black text-white font-black uppercase tracking-widest sm:tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all group shadow-xl">
                                    Proceed To Checkout
                                    <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                                </Button>
                            </Link>

                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100 space-y-3">
                                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                                    Secure SSL Encrypted Checkout
                                </div>
                                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
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
