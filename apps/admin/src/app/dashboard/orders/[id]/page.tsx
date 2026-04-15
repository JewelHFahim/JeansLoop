'use client';

import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ordersApi } from '@/lib/api';
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock, CheckCircle, Truck, FileText, Trash2, Edit2, X, Save } from 'lucide-react';
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

    const statusMutation = useMutation({
        mutationFn: (status: string) => ordersApi.updateStatus(id as string, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => ordersApi.delete(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            router.push('/dashboard/orders');
        },
        onError: (error: any) => {
            alert('Failed to delete order: ' + (error.response?.data?.message || error.message));
        }
    });

    const detailsMutation = useMutation({
        mutationFn: (data: any) => ordersApi.updateDetails(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
            setIsEditing(false);
        },
        onError: (error: any) => {
            alert('Failed to update details: ' + (error.response?.data?.message || error.message));
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({
        shippingAddress: {},
        totalAmount: 0,
        exchangeAmount: 0,
        bkashNumber: '',
        bkashTxnId: '',
    });

    const handleEditStart = () => {
        if (order) {
            setEditForm({
                shippingAddress: { ...order.shippingAddress },
                totalAmount: order.totalAmount,
                exchangeAmount: order.exchangeAmount || 0,
                bkashNumber: order.bkashNumber || '',
                bkashTxnId: order.bkashTxnId || '',
            });
            setIsEditing(true);
        }
    };

    const handleSaveDetails = () => {
        if(window.confirm('Are you sure you want to save these administrative changes? This action will be logged.')) {
           detailsMutation.mutate({
               shippingAddress: editForm.shippingAddress,
               totalAmount: Number(editForm.totalAmount),
               exchangeAmount: Number(editForm.exchangeAmount),
               bkashNumber: editForm.bkashNumber,
               bkashTxnId: editForm.bkashTxnId,
           });
        }
    };

    const handleDelete = () => {
        if (window.confirm('CRITICAL: Are you sure you want to permanently delete this order record? This action cannot be undone.')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) return <div className="p-8 text-xs font-black uppercase animate-pulse">Retrieving Transaction Data...</div>;
    if (error) return <div className="p-8 text-red-600 font-black uppercase">Critical Error: Transaction Record Unreachable</div>;
    if (!order) return <div className="p-8 text-gray-500 font-black uppercase">Order Not Found in Registry</div>;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

    const statuses = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'COURIERED', label: 'Couriered / In Transit' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'RETURNED', label: 'Return' },
        { value: 'EXCHANGE', label: 'Exchange' },
    ];

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
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">Update Stage:</span>
                    <select
                        value={order.status}
                        onChange={(e) => statusMutation.mutate(e.target.value)}
                        disabled={statusMutation.isPending || order.status === 'CANCELLED'}
                        className="rounded-none border-2 border-black h-11 px-6 font-black uppercase tracking-widest text-[11px] bg-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none outline-none cursor-pointer disabled:opacity-50"
                    >
                        {statuses.map((s) => (
                            <option 
                                key={s.value} 
                                value={s.value}
                                disabled={order.status === 'DELIVERED' && s.value !== 'EXCHANGE' && s.value !== 'DELIVERED'}
                            >
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/orders/${order._id}/invoice`}>
                        <Button title="Print / Invoice" className="rounded-none bg-emerald-600 text-white h-11 w-11 p-0 flex items-center justify-center hover:bg-emerald-700 transition-all shadow-[6px_6px_0px_0px_rgba(22,163,74,0.2)]">
                            <FileText className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        title="Delete Order"
                        className="rounded-none bg-red-600 text-white h-11 w-11 p-0 flex items-center justify-center hover:bg-red-700 transition-all shadow-[6px_6px_0px_0px_rgba(239,68,68,0.2)]"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
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
                                                        <div className="w-12 h-12 border-2 border-black shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black italic text-black uppercase">{item.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono">
                                                            SKU: {item.variantSku} {(item.size || item.color) && `| ${item.size || ''} ${item.color || ''}`.trim()}
                                                        </span>
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
                                            <CheckCircle className="w-4 h-4" /> PAID ({new Date(order.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })})
                                        </span>
                                    ) : (
                                        <span className="text-amber-500 font-black text-[11px] italic underline decoration-2">PENDING PAYMENT</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase text-gray-500">Current Phase:</span>
                                    <span className={`font-black text-[11px] italic uppercase ${order.status === 'DELIVERED' ? 'text-green-600' :
                                            order.status === 'CANCELLED' || order.status === 'RETURNED' ? 'text-red-600' :
                                                order.status === 'EXCHANGE' ? 'text-purple-600' :
                                                    order.status === 'ACCEPTED' || order.status === 'COURIERED' ? 'text-blue-600' :
                                                        'text-amber-500'
                                        }`}>
                                        {statuses.find(s => s.value === order.status)?.label || order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                    <span className="text-[11px] font-black uppercase text-gray-500">Logistics:</span>
                                    {order.isDelivered ? (
                                        <span className="flex items-center gap-2 text-black font-black text-[11px] italic uppercase">
                                            <CheckCircle className="w-4 h-4 text-green-600" /> Dispatch Finalized
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 font-black text-[11px] italic uppercase tracking-wider">In Process / Queue</span>
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
                                    <span className={`text-sm font-black italic uppercase ${
                                        order.paymentMethod === 'cod' ? 'text-amber-600' : 'text-pink-600'
                                    }`}>
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash Transaction'}
                                    </span>
                                </div>
                                {order.paymentIntentId && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Gateway Hash</span>
                                        <span className="text-[11px] font-mono text-black break-all">{order.paymentIntentId}</span>
                                    </div>
                                )}
                                {order.bkashNumber && (
                                    <div className="flex flex-col gap-1 border-t border-gray-100 pt-2">
                                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">bKash Number</span>
                                        <span className="text-sm font-black text-pink-600 italic">{order.bkashNumber}</span>
                                    </div>
                                )}
                                {order.bkashTxnId && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Transaction ID</span>
                                        <span className="text-[11px] font-mono font-black text-black select-all bg-gray-50 p-1 border border-gray-100">{order.bkashTxnId}</span>
                                    </div>
                                )}
                                {order.couponCode && (
                                    <div className="flex flex-col gap-1 border-t border-gray-100 pt-2">
                                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Promotion</span>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 italic">{order.couponCode}</span>
                                            <span className="text-[11px] font-black text-red-500">-৳{order.discountAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Totals */}
                <div className="space-y-6">
                    {isEditing ? (
                        <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
                                <h2 className="text-sm font-black uppercase italic">Administrative Edit</h2>
                                <Button onClick={() => setIsEditing(false)} variant="ghost" className="h-8 w-8 p-0"><X className="w-4 h-4"/></Button>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500">Full Name</label>
                                <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.shippingAddress.fullName || ''} onChange={e => setEditForm((prev: any) => ({...prev, shippingAddress: {...prev.shippingAddress, fullName: e.target.value}}))} />
                                
                                <label className="text-[10px] font-black uppercase text-gray-500">Phone</label>
                                <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.shippingAddress.phone || ''} onChange={e => setEditForm((prev: any) => ({...prev, shippingAddress: {...prev.shippingAddress, phone: e.target.value}}))} />
                                
                                <label className="text-[10px] font-black uppercase text-gray-500">Street</label>
                                <textarea className="w-full border-2 border-black p-2 text-xs" value={editForm.shippingAddress.street || ''} onChange={e => setEditForm((prev: any) => ({...prev, shippingAddress: {...prev.shippingAddress, street: e.target.value}}))} />

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500">City</label>
                                        <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.shippingAddress.city || ''} onChange={e => setEditForm((prev: any) => ({...prev, shippingAddress: {...prev.shippingAddress, city: e.target.value}}))} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500">ZIP</label>
                                        <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.shippingAddress.zip || ''} onChange={e => setEditForm((prev: any) => ({...prev, shippingAddress: {...prev.shippingAddress, zip: e.target.value}}))} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t-2 border-black pt-4 mt-4 space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-500">Base Gross Total (৳)</label>
                                <input type="number" className="w-full border-2 border-black p-2 text-xs" value={editForm.totalAmount} onChange={e => setEditForm((prev: any) => ({...prev, totalAmount: e.target.value}))} />
                                
                                {order?.status === 'EXCHANGE' && (
                                    <>
                                        <label className="text-[10px] font-black uppercase text-gray-500">Exchange Amount (৳) (+/-)</label>
                                        <input type="number" className="w-full border-2 border-black p-2 text-xs bg-amber-50" value={editForm.exchangeAmount} onChange={e => setEditForm((prev: any) => ({...prev, exchangeAmount: e.target.value}))} />
                                    </>
                                )}

                                <div className="border-t-2 border-gray-100 pt-4 mt-4 space-y-3">
                                    <h3 className="text-[10px] font-black uppercase text-pink-600 italic">Financial Registry (bKash)</h3>
                                    <label className="text-[10px] font-black uppercase text-gray-500">Service Number</label>
                                    <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.bkashNumber} onChange={e => setEditForm((prev: any) => ({...prev, bkashNumber: e.target.value}))} />
                                    
                                    <label className="text-[10px] font-black uppercase text-gray-500">Transaction ID (TXID)</label>
                                    <input type="text" className="w-full border-2 border-black p-2 text-xs" value={editForm.bkashTxnId} onChange={e => setEditForm((prev: any) => ({...prev, bkashTxnId: e.target.value}))} />
                                </div>
                            </div>
                            
                            <Button onClick={handleSaveDetails} disabled={detailsMutation.isPending} className="w-full rounded-none bg-black text-white hover:bg-gray-800 font-black uppercase text-[10px] tracking-widest mt-4">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                    ) : (
                        <>
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0 relative mb-6">
                        <Button onClick={handleEditStart} variant="ghost" className="absolute top-3 right-3 h-6 w-6 p-0 hover:bg-gray-200">
                            <Edit2 className="w-3 h-3 text-black" />
                        </Button>
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
                        {order.exchangeAmount ? (
                            <>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest border-b border-white/20 pb-2 text-amber-300">
                                    <span>Exchange Adjustment</span>
                                    <span>{order.exchangeAmount > 0 ? '+' : ''}৳{order.exchangeAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-xs font-black uppercase italic leading-none">Final Gross Total</span>
                                    <span className="text-3xl font-black tracking-tighter italic leading-none text-amber-400">৳{(order.totalAmount + order.exchangeAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 opacity-50">
                                    <span className="text-[10px] font-black uppercase italic leading-none">Original Total</span>
                                    <span className="text-xs font-black tracking-tighter italic leading-none">৳{order.totalAmount?.toLocaleString()}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-xs font-black uppercase italic leading-none">Gross Total</span>
                                <span className="text-3xl font-black tracking-tighter italic leading-none">৳{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
