'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ordersApi } from '@/lib/api';
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock, CheckCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await ordersApi.getById(id as string);
            return response.data;
        },
    });

    const payMutation = useMutation({
        mutationFn: () => ordersApi.markAsPaid(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
    });

    const deliverMutation = useMutation({
        mutationFn: () => ordersApi.markAsDelivered(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
    });

    if (isLoading) return <div className="p-8 text-xs font-black uppercase animate-pulse">Retrieving Transaction Data...</div>;
    if (error) return <div className="p-8 text-red-600 font-black uppercase">Critical Error: Transaction Record Unreachable</div>;
    if (!order) return <div className="p-8 text-gray-500 font-black uppercase">Order Not Found in Registry</div>;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header Navigation */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders">
                        <Button variant="outline" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Order Details</h1>
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1">Registry ID: {order._id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!order.isPaid && (
                        <Button
                            onClick={() => payMutation.mutate()}
                            disabled={payMutation.isPending}
                            className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            Execute / Mark as Paid
                        </Button>
                    )}
                    {order.isPaid && !order.isDelivered && (
                        <Button
                            onClick={() => deliverMutation.mutate()}
                            disabled={deliverMutation.isPending}
                            className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            Execute / Mark Delivered
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                        <div className="bg-gray-50 border-b-4 border-black p-4 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Itemized Registry</h2>
                        </div>
                        <div className="p-4">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-black/60">
                                        <th className="pb-2 text-left">Product</th>
                                        <th className="pb-2 text-center">Qty</th>
                                        <th className="pb-2 text-right">Unit</th>
                                        <th className="pb-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item: any, idx: number) => (
                                        <tr key={idx} className="group">
                                            <td className="py-2 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <div className="w-12 h-12 border-2 border-black flex-shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black italic text-black uppercase">{item.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono">SKU: {item.variantSku}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 border-b border-gray-100 text-center font-black text-[11px]">{item.quantity}</td>
                                            <td className="py-2 border-b border-gray-100 text-right font-black text-[11px]">৳{item.price?.toLocaleString()}</td>
                                            <td className="py-2 border-b border-gray-100 text-right font-black text-[11px]">৳{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Transaction Status */}
                        <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                            <div className="bg-gray-50 border-b-4 border-black p-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Status Module</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase text-gray-500">Payment:</span>
                                    {order.isPaid ? (
                                        <span className="flex items-center gap-2 text-green-600 font-black text-[11px] italic">
                                            <CheckCircle className="w-4 h-4" /> PAID ({new Date(order.paidAt).toLocaleDateString()})
                                        </span>
                                    ) : (
                                        <span className="text-amber-500 font-black text-[11px] italic underline decoration-2">PENDING PAYMENT</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase text-gray-500">Logistics:</span>
                                    {order.isDelivered ? (
                                        <span className="flex items-center gap-2 text-black font-black text-[11px] italic">
                                            <Truck className="w-4 h-4" /> DELIVERED ({new Date(order.deliveredAt).toLocaleDateString()})
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 font-black text-[11px] italic">AWAITING DISPATCH</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                            <div className="bg-gray-50 border-b-4 border-black p-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Finance Module</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Protocol</span>
                                    <span className="text-sm font-black italic uppercase text-black">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash Transaction'}
                                    </span>
                                </div>
                                {order.paymentIntentId && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Gateway Hash</span>
                                        <span className="text-[11px] font-mono text-black break-all">{order.paymentIntentId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Totals */}
                <div className="space-y-6">
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                        <div className="bg-gray-50 border-b-4 border-black p-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Logistics Data</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-500">Consignee</span>
                                <span className="text-sm font-black italic uppercase text-black">{order.shippingAddress?.fullName}</span>
                                <span className="text-[11px] font-bold text-gray-700">{order.shippingAddress?.phone}</span>
                            </div>
                            <div className="flex flex-col border-t-2 border-gray-50 pt-4">
                                <span className="text-[10px] font-black uppercase text-gray-500">Coordinates</span>
                                <span className="text-xs font-black text-black leading-relaxed">
                                    {order.shippingAddress?.street},<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                    {order.shippingAddress?.country} {order.shippingAddress?.zip}
                                </span>
                            </div>
                            {order.shippingAddress?.note && (
                                <div className="flex flex-col border-t-2 border-gray-50 pt-4 bg-gray-50 p-3">
                                    <span className="text-[10px] font-black uppercase text-gray-500">Order Note</span>
                                    <span className="text-[11px] italic text-black mt-1">"{order.shippingAddress.note}"</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-4 border-black bg-black text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] flex flex-col p-6 space-y-4">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest border-b border-white/20 pb-2">
                            <span>Subtotal</span>
                            <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest border-b border-white/20 pb-2">
                            <span>Logistics</span>
                            <span>৳{order.shippingPrice?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest border-b border-white/20 pb-2 text-white/50">
                            <span>State Tax</span>
                            <span>৳{order.taxPrice?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-xs font-black uppercase italic leading-none">Gross Total</span>
                            <span className="text-3xl font-black tracking-tighter italic leading-none">৳{order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
