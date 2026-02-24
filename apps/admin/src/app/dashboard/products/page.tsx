'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi } from '@/lib/api';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, isPlaceholderData, isFetching } = useQuery({
        queryKey: ['products', page, searchQuery],
        queryFn: async () => {
            const response = await productsApi.getAll({
                page,
                limit: 10,
                keyword: searchQuery || undefined
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Console / Products</h1>
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mt-1.5">Inventory Control / Nexus</p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Execute / Add Product
                    </Button>
                </Link>
            </div>

            <div className={`border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0 transition-opacity ${isLoading && !isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                <div className="bg-gray-50 border-b-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Active Inventory Registry</h2>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="SEARCH FOR ASSETS..."
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
                </div>

                <div className="overflow-x-auto p-4">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-black">
                                <th className="p-4 text-left border-b-2 border-gray-100">Identifier / Name</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Category</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Price</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Stock Units</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Status</th>
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
                            ) : data?.products?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center border-b border-gray-100 font-black uppercase text-gray-300 italic">
                                        No assets found matching the query
                                    </td>
                                </tr>
                            ) : (
                                data?.products?.map((product: any) => {
                                    // Category color mapping
                                    const getCategoryStyle = (cat: string) => {
                                        const c = cat?.toLowerCase();
                                        if (c?.includes('jeans')) return 'bg-blue-50 text-blue-700 border-blue-200';
                                        if (c?.includes('twill')) return 'bg-orange-50 text-orange-700 border-orange-200';
                                        if (c?.includes('trouser')) return 'bg-slate-50 text-slate-700 border-slate-200';
                                        if (c?.includes('shirt')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                        if (c?.includes('shorts')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
                                        if (c?.includes('socks')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                                        if (c?.includes('jacket')) return 'bg-rose-50 text-rose-700 border-rose-200';
                                        if (c?.includes('access')) return 'bg-purple-50 text-purple-700 border-purple-200';
                                        return 'bg-amber-50 text-amber-700 border-amber-200';
                                    };

                                    return (
                                        <tr key={product._id} className="group hover:bg-gray-50/80 transition-colors">
                                            <td className="p-4 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 border-2 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                        {product.images?.length > 0 ? (
                                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-[10px] font-black opacity-20 italic text-black">IMG</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black italic text-black">{product.name}</span>
                                                        <span className="text-[9px] text-gray-500 font-mono mt-1 uppercase">ID: {product._id?.slice(-8)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-gray-100">
                                                <span className={`inline-block border px-3 py-1 text-[9px] font-black tracking-widest rounded-sm ${getCategoryStyle(product.category)}`}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-gray-100 font-black text-sm text-emerald-600">৳{product.price?.toLocaleString()}</td>
                                            <td className="p-4 border-b border-gray-100">
                                                <span className="flex items-center gap-2 text-black">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                                    {product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0} UNITS
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-gray-100">
                                                {product.isDraft ? (
                                                    <span className="inline-block bg-amber-400 text-black px-3 py-1 text-[9px] font-black tracking-[0.2em] italic rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                        DRAFTED
                                                    </span>
                                                ) : (
                                                    <span className="inline-block bg-green-500 text-white px-3 py-1 text-[9px] font-black tracking-[0.2em] italic rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                                        PUBLISHED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-right">
                                                <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <a
                                                        href={`${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}/product/${product.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="outline" size="sm" className="rounded-none border-2 border-green-600 text-green-600 h-10 w-10 p-0 hover:bg-green-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(22,163,74,0.1)]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </Button>
                                                    </a>
                                                    <Link href={`/dashboard/products/${product._id}`}>
                                                        <Button variant="outline" size="sm" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-none border-2 border-red-600 text-red-600 h-10 w-10 p-0 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,0.1)]"
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {data?.pages > 1 && (
                    <div className="p-8 border-t-4 border-black bg-gray-50 flex justify-center items-center gap-6">
                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-none border-2 border-black h-12 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[10px] px-8 disabled:opacity-20 transition-all"
                        >
                            Previous Sector
                        </Button>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center h-12 border-x-2 border-gray-200 px-8">
                            Sector {page} / {data.pages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= data.pages}
                            className="rounded-none border-2 border-black h-12 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[10px] px-8 disabled:opacity-20 transition-all"
                        >
                            Next Sector
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
