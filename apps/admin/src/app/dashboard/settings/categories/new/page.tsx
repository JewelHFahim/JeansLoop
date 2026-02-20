'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoriesApi, uploadApi } from '@/lib/api';
import { ChevronLeft, Save, Upload, X, FolderPlus } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => categoriesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            router.push('/dashboard/settings/categories');
        },
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setForm({ ...form, name, slug });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsLoading(true);
        try {
            const response = await uploadApi.uploadImage(e.target.files[0]);
            const imageUrl = response.data.image;
            if (imageUrl) {
                setForm({ ...form, image: imageUrl });
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Security Breach: Asset Upload Protocol Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.slug) {
            alert('Domain Error: Core Identity Fields Required');
            return;
        }
        createMutation.mutate(form);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20 text-black">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/settings/categories">
                        <Button variant="outline" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-black">Initialize / New Domain</h1>
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1">Taxonomy Vector Assignment</p>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || isLoading}
                    className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    <Save className="mr-2 h-3.5 w-3.5" />
                    Commit / Deploy Domain
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Core Data */}
                <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                    <div className="bg-gray-50 border-b-4 border-black p-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Identity / Core</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Domain Name</label>
                                <Input
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="EX: TECHWEAR SERIES"
                                    className="rounded-none border-2 border-black font-bold uppercase placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Registry Slug</label>
                                <Input
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="techwear-series"
                                    className="rounded-none border-2 border-black font-mono text-[11px] placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all text-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description / Protocol</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-none border-2 border-black p-3 text-xs font-bold uppercase placeholder:text-gray-300 focus-visible:outline-none bg-white transition-all min-h-[100px] text-black"
                                    placeholder="Enter domain specifications..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Assets */}
                <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pt-0">
                    <div className="bg-gray-50 border-b-4 border-black p-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Visual Asset</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div
                            className="relative border-2 border-dashed border-black bg-white aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group"
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isLoading}
                            />
                            {isLoading ? (
                                <div className="text-[10px] font-black uppercase animate-pulse">Syncing...</div>
                            ) : form.image ? (
                                <div className="relative w-full h-full group">
                                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="text-white w-6 h-6" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setForm({ ...form, image: '' }); }}
                                        className="absolute top-2 right-2 bg-black text-white p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FolderPlus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Inject Asset Vector</span>
                                </>
                            )}
                        </div>
                        <p className="text-[9px] font-black uppercase text-gray-400 italic">Recommended: 16:9 Aspect Ratio / Grayscale Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
