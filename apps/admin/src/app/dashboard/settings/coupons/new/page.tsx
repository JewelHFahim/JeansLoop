'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { couponsApi } from '@/lib/api';
import { ChevronLeft, Save, TicketPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewCouponPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        minAmount: 0,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        isActive: true,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => couponsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            router.push('/dashboard/settings/coupons');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.code || form.value <= 0) {
            alert('Protocol Error: Code and Value Required');
            return;
        }
        createMutation.mutate(form);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20 text-black">
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/settings/coupons">
                        <Button variant="outline" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Initialize / New Promo</h1>
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1">Promotion Vector Assignment</p>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    <Save className="mr-2 h-3.5 w-3.5" />
                    Commit / Deploy Promo
                </Button>
            </div>

            <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                <div className="bg-gray-50 border-b-4 border-black p-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Promo Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Promo Code</label>
                                <Input
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    placeholder="EX: SUMMER2026"
                                    className="rounded-none border-2 border-black font-black uppercase placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Discount Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                    className="w-full rounded-none border-2 border-black p-2 text-xs font-black uppercase focus-visible:outline-none bg-white"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (৳)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Value</label>
                                <Input
                                    type="number"
                                    value={form.value}
                                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                                    className="rounded-none border-2 border-black font-black placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Min. Order Amount</label>
                                <Input
                                    type="number"
                                    value={form.minAmount}
                                    onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })}
                                    className="rounded-none border-2 border-black font-black placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Expiry Date</label>
                                <Input
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                                    className="rounded-none border-2 border-black font-black focus-visible:ring-0 bg-white transition-all px-2"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="hidden"
                                    />
                                    <div className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all ${form.isActive ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white'}`}>
                                        {form.isActive && <Save className="w-4 h-4" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Activate Promo</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-4 border-black p-8 flex items-center gap-6 bg-amber-50 shadow-[8px_8px_0px_0px_rgba(245,158,11,0.2)]">
                <TicketPlus className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                    <h3 className="text-xs font-black uppercase">Protocol Reminder</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Once deployed, promo codes cannot be renamed. Ensure the identifier follows standard nomenclature.</p>
                </div>
            </div>
        </div>
    );
}
