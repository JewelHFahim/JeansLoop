'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { couponsApi } from '@/lib/api';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCouponPage() {
    const router = useRouter();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        minAmount: 0,
        expiryDate: '',
        isActive: true,
    });

    const { data: coupon, isLoading } = useQuery({
        queryKey: ['coupon', id],
        queryFn: () => couponsApi.getById(id as string).then(res => res.data),
        enabled: !!id,
    });

    useEffect(() => {
        if (coupon) {
            setForm({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minAmount: coupon.minAmount,
                expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
                isActive: coupon.isActive,
            });
        }
    }, [coupon]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => couponsApi.update(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            queryClient.invalidateQueries({ queryKey: ['coupon', id] });
            router.push('/dashboard/settings/coupons');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.code || form.value <= 0) {
            alert('Protocol Error: Code and Value Required');
            return;
        }
        updateMutation.mutate(form);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
            </div>
        );
    }

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
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Modify / Promotion</h1>
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1">Promotion Persistence Rewriting</p>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    <Save className="mr-2 h-3.5 w-3.5" />
                    Apply / Re-deploy Promo
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
                                    readOnly
                                    className="rounded-none border-2 border-black font-black uppercase bg-gray-100 opacity-50 cursor-not-allowed"
                                />
                                <p className="text-[9px] font-black text-gray-400 uppercase italic">Code identity immutable after deployment</p>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active State</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
