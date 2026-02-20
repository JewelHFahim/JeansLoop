'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { usersApi } from '@/lib/api';
import { Users, Trash2, Shield, User as UserIcon, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users, isLoading, isPlaceholderData, isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await usersApi.getAll();
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => usersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete user "${name}"?`)) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const filteredUsers = users?.filter((user: any) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Console / Users</h1>
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1.5">Identity Management / Security</p>
                </div>
            </div>

            <div className={`border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0 transition-opacity ${isLoading && !isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
                <div className="bg-gray-50 border-b-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Active Personnel Directory</h2>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="SEARCH BY IDENTITY..."
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
                                <th className="p-4 text-left border-b-2 border-gray-100">Name / Identity</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Role</th>
                                <th className="p-4 text-left border-b-2 border-gray-100">Phone</th>
                                <th className="p-4 text-center border-b-2 border-gray-100">Orders</th>
                                <th className="p-4 text-right border-b-2 border-gray-100">Revenue</th>
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
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center border-b border-gray-100 font-black uppercase text-gray-300 italic">
                                        No personnel found matching the identity search
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers?.map((user: any) => (
                                    <tr key={user._id} className="group hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic text-black">{user.name}</span>
                                                    <span className="text-[9px] text-gray-400 lowercase">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-100">
                                            {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                                                <span className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 text-[9px] font-black tracking-widest rounded-none">
                                                    <Shield className="w-3 h-3" />
                                                    ADMIN
                                                </span>
                                            ) : (
                                                <span className="inline-block border-2 border-black px-2.5 py-0.5 text-[9px] font-black tracking-widest">
                                                    USER
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 font-black text-[10px] text-gray-500">
                                            {user.phone || 'N/A'}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-center">
                                            <span className="font-black text-xs text-black">{user.totalOrders || 0}</span>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-right">
                                            <span className="font-black text-sm text-emerald-600">৳{(user.totalSpent || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none border-2 border-red-600 text-red-600 h-10 w-10 p-0 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,0.1)] opacity-40 group-hover:opacity-100"
                                                onClick={() => handleDelete(user._id, user.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t-4 border-black bg-gray-50 text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Total Identity Count: {users?.length || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
