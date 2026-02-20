'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ordersApi } from '@/lib/api';
import { ShoppingCart, Eye, User, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, isPlaceholderData, isFetching } = useQuery({
        queryKey: ['orders', page, limit, searchQuery],
        queryFn: async () => {
            const response = await ordersApi.getAll({
                page,
                limit,
                keyword: searchQuery || undefined
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.pages || 1;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Console / Orders</h1>
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1.5">Transaction Registry / Core</p>
                </div>
            </div>

            <div className={`border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0 transition-opacity ${isLoading && !isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                <div className="bg-gray-50 border-b-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Active Transaction Registry</h2>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="SEARCH TRANSACTIONS..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full bg-white border-2 border-black rounded-none text-[10px] font-black px-3 py-2 pl-9 outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-300"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                {isFetching ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black group-focus-within:text-white" />
                                ) : (
                                    <Search className="w-3.5 h-3.5 text-black group-focus-within:text-white" />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Rows / View:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="bg-white border-2 border-black rounded-none text-[10px] font-black px-2 py-1 outline-none focus:bg-black focus:text-white transition-all cursor-pointer"
                            >
                                {[10, 20, 50, 100].map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto p-4 pb-0">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-black">
                                <th className="p-4 text-left border-b-2 border-gray-100">Order ID / Date</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Customer</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Method</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Amount</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Payment Status</th>
                                <th className="p-4 text-right border-b-2 border-gray-100">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold uppercase tracking-tight">
                            {isLoading && !isPlaceholderData ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="p-8 border-b border-gray-100">
                                            <div className="h-10 bg-gray-100 rounded-none w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : data?.orders?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center border-b border-gray-100 font-black uppercase text-gray-300 italic">
                                        No transactions found matching the query
                                    </td>
                                </tr>
                            ) : (
                                data?.orders?.map((order: any) => (
                                    <tr key={order._id} className="group hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 border-b border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black italic text-black">#{order._id?.slice(-8).toUpperCase()}</span>
                                                <span className="text-[9px] text-gray-500 font-mono mt-1 uppercase">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-none text-[9px]">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-black">{order.userId?.name || 'Guest User'}</span>
                                                    <div className="flex flex-col gap-0.5 mt-0.5">
                                                        <span className="text-[9px] text-gray-400 lowercase">{order.shippingAddress?.email}</span>
                                                        <span className="text-[9px] text-gray-500 font-bold">{order.shippingAddress?.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="inline-block border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest w-fit">
                                                    {order.paymentMethod === 'cod' ? 'CASH' : 'BKASH'}
                                                </span>
                                                {order.paymentMethod === 'bkash' && (
                                                    <div className="flex flex-col mt-1 space-y-0.5">
                                                        <span className="text-[9px] font-black text-pink-600 uppercase">Num: {order.bkashNumber || 'N/A'}</span>
                                                        <span className="text-[9px] font-black text-gray-400 uppercase">TXID: {order.bkashTxnId || 'N/A'}</span>
                                                    </div>
                                                )}
                                                {order.couponCode && (
                                                    <div className="flex flex-col mt-1.5 pt-1 border-t border-gray-100">
                                                        <span className="text-[9px] font-black text-blue-600 uppercase italic">Code: {order.couponCode}</span>
                                                        <span className="text-[9px] font-black text-blue-400 uppercase">Discount: -৳{order.discountAmount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 font-black text-sm text-black">
                                            ৳{order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="p-4 border-b border-gray-100">
                                            {order.isPaid ? (
                                                <span className="inline-block bg-green-500 text-white px-3 py-1 text-[9px] font-black tracking-[0.2em] italic rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                                    PAID
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-amber-400 text-black px-3 py-1 text-[9px] font-black tracking-[0.2em] italic rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                    PENDING
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-right">
                                            <Link href={`/dashboard/orders/${order._id}`}>
                                                <Button variant="outline" size="sm" className="rounded-none border-2 border-black h-10 px-4 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group/btn">
                                                    <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Details</span>
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t-4 border-black bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Registry Sector {page} of {totalPages}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-none border-2 border-black h-9 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[9px] px-4 disabled:opacity-20 transition-all"
                        >
                            Back
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <Button
                                    key={p}
                                    variant="outline"
                                    onClick={() => setPage(p)}
                                    className={`rounded-none border-2 border-black h-9 w-9 p-0 font-black text-[9px] transition-all ${page === p ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= totalPages}
                            className="rounded-none border-2 border-black h-9 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[9px] px-4 disabled:opacity-20 transition-all"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
