'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categoriesApi } from '@/lib/api';
import { Plus, Edit, Trash2, FolderOpen, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: categories, isLoading, isPlaceholderData, isFetching } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoriesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const filteredCategories = categories?.filter((cat: any) =>
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Console / Categories</h1>
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mt-1.5">Taxonomy Management / System</p>
                </div>
                <Link href="/dashboard/settings/categories/new">
                    <Button className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Execute / Add Category
                    </Button>
                </Link>
            </div>

            <div className={`border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0 transition-opacity ${isLoading && !isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                <div className="bg-gray-50 border-b-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Active Domain Registry</h2>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="SEARCH DOMAINS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                <th className="p-4 text-left border-b-2 border-gray-100">Domain / Identifier</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Slug</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Description</th>
                                <th className="p-4 text-right border-b-2 border-gray-100">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold uppercase tracking-tight">
                            {isLoading && !isPlaceholderData ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="p-8 border-b border-gray-100">
                                            <div className="h-10 bg-gray-100 rounded-none w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredCategories?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center border-b border-gray-100 font-black uppercase text-gray-300 italic">
                                        No domains found matching the registry query
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories?.map((category: any) => (
                                    <tr key={category._id} className="group hover:bg-gray-50/80 transition-colors text-black">
                                        <td className="p-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 border-2 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                    {category.image ? (
                                                        <img src={category.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FolderOpen className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic">{category.name}</span>
                                                    <span className="text-[9px] text-gray-500 font-mono mt-1 uppercase">ID: {category._id?.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 font-mono text-[10px] text-gray-600 italic">
                                            {category.slug}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 max-w-xs truncate text-[10px] text-gray-500">
                                            {category.description || 'No Protocol Established'}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-right">
                                            <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/dashboard/settings/categories/${category._id}`}>
                                                    <Button variant="outline" size="sm" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-none border-2 border-red-600 text-red-600 h-10 w-10 p-0 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,0.1)]"
                                                    onClick={() => handleDelete(category._id, category.name)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
