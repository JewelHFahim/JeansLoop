'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ordersApi, settingsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePage() {
    const { id } = useParams();

    const { data: order, isLoading: isOrderLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await ordersApi.getById(id as string);
            return response.data;
        },
    });

    const { data: settings, isLoading: isSettingsLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await settingsApi.get();
            return response.data;
        },
    });

    if (isOrderLoading || isSettingsLoading) return <div className="p-8 text-xs font-black uppercase animate-pulse">Generating Invoice...</div>;
    if (!order) return <div className="p-8">Order not found</div>;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white min-h-screen">
            <style jsx global>{`
                @media print {
                    aside, .no-print {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    .invoice-container {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                    }
                    body {
                        background: white !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* Controls */}
            <div className="no-print flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                <Link href="/dashboard/orders">
                    <Button variant="outline" className="rounded-none border-2 border-black font-black uppercase text-[10px] tracking-widest h-10">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Registry
                    </Button>
                </Link>
                <Button 
                    onClick={handlePrint}
                    className="rounded-none bg-black text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <Printer className="w-4 h-4 mr-2" /> Print / Download Invoice
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="invoice-container border-4 border-black p-8 md:p-12 max-w-4xl mx-auto bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b-4 border-black pb-8">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none mb-1">{settings?.title || 'JeansLoop'}</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">{settings?.tagline || 'Premium Denim & Apparel'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black uppercase italic leading-none mb-2">Invoice</h2>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest"><span className="text-gray-400">ID:</span> #{order._id?.slice(-12).toUpperCase()}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest"><span className="text-gray-400">DATE:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest"><span className="text-gray-400">STATUS:</span> {order.status}</p>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">From</h3>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase text-black">{settings?.title || 'JeansLoop Warehouse'}</p>
                            <p className="text-[10px] font-bold text-gray-600">{settings?.address || 'Dhaka, Bangladesh'}</p>
                            <p className="text-[10px] font-bold text-gray-600">{settings?.email || 'support@jeansloop.com'}</p>
                            <p className="text-[10px] font-bold text-gray-600">{settings?.phone || '+880 1XXX XXXXXX'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Bill To / Ship To</h3>
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase italic text-black">{order.shippingAddress?.fullName}</p>
                            <p className="text-[10px] font-bold text-gray-600">{order.shippingAddress?.phone}</p>
                            <p className="text-[10px] font-bold text-gray-600 leading-relaxed uppercase">
                                {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                                {order.shippingAddress?.state}, {order.shippingAddress?.country} {order.shippingAddress?.zip}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="text-left py-3 text-[10px] font-black uppercase tracking-widest text-black">Description</th>
                                <th className="text-center py-3 text-[10px] font-black uppercase tracking-widest text-black">Qty</th>
                                <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest text-black">Price</th>
                                <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest text-black">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items?.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase italic text-black">{item.name}</span>
                                            <span className="text-[9px] font-bold text-gray-400 font-mono uppercase italic">
                                                Variant: {item.variantSku?.split('-').pop()} {(item.size || item.color) && `| ${item.size || ''} ${item.color || ''}`.trim()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center text-xs font-black text-black">{item.quantity}</td>
                                    <td className="py-4 text-right text-xs font-black text-black">৳{item.price?.toLocaleString()}</td>
                                    <td className="py-4 text-right text-xs font-black text-black">৳{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="flex flex-col md:flex-row justify-between gap-8 pt-8 border-t-2 border-black">
                    <div className="max-w-xs">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Payment Protocol</p>
                        <p className="text-xs font-black italic uppercase mb-1 text-black">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Digital Transaction (bKash)'}</p>
                        <p className="text-[9px] font-bold text-gray-500 italic">This is a computer-generated transaction record for the customer's registry. No signature required.</p>
                    </div>
                    <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-gray-400">Net Subtotal</span>
                            <span className="text-black text-sm">৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-gray-400">Logistics / Shipping</span>
                            <span className="text-black text-sm">৳{order.shippingPrice?.toLocaleString() || '0'}</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-500">
                                <span>Privilege Discount</span>
                                <span className="text-sm">-৳{order.discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-3 border-t-2 border-black">
                            <span className="text-xs font-black uppercase italic leading-none text-black">Gross Total</span>
                            <span className="text-2xl font-black italic leading-none text-black">৳{order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="mt-16 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic">Thank you for your business / JeansLoop Registry</p>
                </div>
            </div>
        </div>
    );
}
