'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { slidersApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewSliderPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        primaryCtaText: '',
        primaryCtaHref: '',
        secondaryCtaText: '',
        secondaryCtaHref: '',
        order: 0,
        isActive: true,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const res = await uploadApi.uploadImage(file);
            setFormData({ ...formData, image: res.data.url });
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                title: data.title,
                subtitle: data.subtitle,
                image: data.image,
                isActive: data.isActive,
                order: Number(data.order),
                primaryCta: data.primaryCtaText && data.primaryCtaHref ? {
                    text: data.primaryCtaText,
                    href: data.primaryCtaHref
                } : null,
                secondaryCta: data.secondaryCtaText && data.secondaryCtaHref ? {
                    text: data.secondaryCtaText,
                    href: data.secondaryCtaHref
                } : null,
            };
            await slidersApi.create(payload);
        },
        onSuccess: () => {
            toast.success('Slider created successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
            router.push('/dashboard/sliders');
        },
        onError: () => {
            toast.error('Failed to create slider');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
                <Link href="/dashboard/sliders">
                    <Button variant="outline" size="icon" className="h-12 w-12 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">New Slider</h1>
                    <p className="text-gray-500 text-sm font-bold tracking-widest uppercase mt-1">Create a new hero section slide</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white border-2 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                {/* Image Upload */}
                <div className="space-y-4">
                    <Label className="text-sm font-black uppercase tracking-widest">Background Image *</Label>
                    <div className="border-2 border-dashed border-black p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <Loader2 className="h-8 w-8 animate-spin text-black" />
                                <p className="text-sm font-bold uppercase tracking-widest">Uploading...</p>
                            </div>
                        ) : formData.image ? (
                            <div className="relative h-48 w-full">
                                <img src={formData.image} alt="Preview" className="object-cover w-full h-full border-2 border-black" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                        <UploadCloud className="w-5 h-5" /> Change Image
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 py-8">
                                <UploadCloud className="h-10 w-10 text-gray-400 group-hover:text-black transition-colors" />
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">Click or drag to upload</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm font-black uppercase tracking-widest">Title (Supports \n for newlines) *</Label>
                        <Input
                            required
                            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                            placeholder="e.g. Elevate Your \n Everyday"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm font-black uppercase tracking-widest">Subtitle *</Label>
                        <Input
                            required
                            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        />
                    </div>

                    {/* Primary CTA */}
                    <div className="space-y-4 p-4 border-2 border-gray-200">
                        <Label className="text-sm font-black uppercase tracking-widest text-gray-500">Primary Button (Optional)</Label>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">Text</Label>
                            <Input
                                className="h-10 border-2 border-black rounded-none focus-visible:ring-0"
                                placeholder="Shop Now"
                                value={formData.primaryCtaText}
                                onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">Link (href)</Label>
                            <Input
                                className="h-10 border-2 border-black rounded-none focus-visible:ring-0"
                                placeholder="/shop?category=JEANS"
                                value={formData.primaryCtaHref}
                                onChange={(e) => setFormData({ ...formData, primaryCtaHref: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Secondary CTA */}
                    <div className="space-y-4 p-4 border-2 border-gray-200">
                        <Label className="text-sm font-black uppercase tracking-widest text-gray-500">Secondary Button (Optional)</Label>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">Text</Label>
                            <Input
                                className="h-10 border-2 border-black rounded-none focus-visible:ring-0"
                                placeholder="View Collection"
                                value={formData.secondaryCtaText}
                                onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">Link (href)</Label>
                            <Input
                                className="h-10 border-2 border-black rounded-none focus-visible:ring-0"
                                placeholder="/shop"
                                value={formData.secondaryCtaHref}
                                onChange={(e) => setFormData({ ...formData, secondaryCtaHref: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-widest">Order</Label>
                        <Input
                            type="number"
                            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-black"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 border-2 border-black rounded-sm accent-black cursor-pointer"
                        />
                        <Label className="text-sm font-black uppercase tracking-widest cursor-pointer" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                            Active
                        </Label>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={createMutation.isPending || isUploading || !formData.image}
                    className="w-full h-14 bg-black text-white hover:bg-gray-900 border-2 border-black font-black uppercase tracking-widest text-sm rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {createMutation.isPending ? 'Creating...' : 'Create Slider'}
                </Button>
            </form>
        </div>
    );
}
