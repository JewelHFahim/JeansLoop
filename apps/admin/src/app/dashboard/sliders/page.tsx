'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slidersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Slider } from '@repo/shared';

export default function SlidersPage() {
    const queryClient = useQueryClient();

    const { data: slidersResponse, isLoading } = useQuery({
        queryKey: ['admin-sliders'],
        queryFn: async () => {
            const res = await slidersApi.getAll();
            return res.data;
        },
    });

    const sliders: Slider[] = slidersResponse?.data || [];

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await slidersApi.delete(id);
        },
        onSuccess: () => {
            toast.success('Slider deleted');
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
        },
        onError: () => {
            toast.error('Failed to delete slider');
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b-4 border-black pb-6 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Hero Sliders</h1>
                    <p className="text-gray-500 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-1">Manage Storefront Hero Carousel</p>
                </div>
                <Link href="/dashboard/sliders/new" className="w-full sm:w-auto">
                    <Button className="w-full h-12 border-2 border-black bg-black text-white px-6 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black rounded-none transition-all shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
                        <Plus className="mr-2 h-4 w-4" /> Add Slider
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center border-2 border-black">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {sliders.length === 0 ? (
                        <div className="p-12 text-center border-2 border-black border-dashed bg-gray-50">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No sliders found.</p>
                        </div>
                    ) : (
                        sliders.map((slider) => (
                            <div key={slider.id} className="border-2 border-black bg-white p-4 flex flex-col md:flex-row gap-6 items-center shadow-[6px_6px_0_rgba(0,0,0,0.1)] md:shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                                <div className="w-full md:w-48 h-48 md:h-32 shrink-0 border-2 border-black relative overflow-hidden bg-gray-100">
                                    <img src={slider.image} alt="Slider image" className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-black text-lg md:text-xl uppercase italic whitespace-pre-line leading-tight">{slider.title}</h3>
                                        <div className="flex gap-2">
                                            {!slider.isActive && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                    Inactive
                                                </span>
                                            )}
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                                Order: {slider.order}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] md:text-sm text-gray-600 font-medium line-clamp-2">{slider.subtitle}</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto justify-end border-t-2 md:border-t-0 pt-4 md:pt-0 border-gray-50 md:mt-0">
                                    <Link href={`/dashboard/sliders/${slider.id}`}>
                                        <Button variant="outline" size="icon" className="h-10 w-10 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-2 border-red-500 text-red-500 rounded-none hover:bg-red-500 hover:text-white transition-colors"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this slider?')) {
                                                if (slider.id) deleteMutation.mutate(slider.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
