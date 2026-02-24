'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productsApi, uploadApi, categoriesApi } from '@/lib/api';
import { ChevronLeft, Plus, Trash2, Upload, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        price: 0,
        category: '',
        isDraft: true,
        images: [] as string[],
        variants: [
            { sku: '', size: '', color: '', price: 0, stock: 0 }
        ]
    });

    const { data: product, isLoading: queryLoading } = useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const response = await productsApi.getById(id);
            return response.data;
        },
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || '',
                slug: product.slug || '',
                description: product.description || '',
                price: product.price || 0,
                category: product.category || '',
                isDraft: product.isDraft ?? true,
                images: product.images || [],
                variants: product.variants?.length > 0 ? product.variants : [{ sku: '', size: '', color: '', price: 0, stock: 0 }]
            });
        }
    }, [product]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => productsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            router.push('/dashboard/products');
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
                setForm({ ...form, images: [...form.images, imageUrl] });
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Security Breach: Image Upload Protocols Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...form.images];
        newImages.splice(index, 1);
        setForm({ ...form, images: newImages });
    };

    const addVariant = () => {
        setForm({
            ...form,
            variants: [...form.variants, { sku: '', size: '', color: '', price: form.price, stock: 0 }]
        });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...form.variants];
        newVariants.splice(index, 1);
        setForm({ ...form, variants: newVariants });
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...form.variants];
        (newVariants[index] as any)[field] = value;
        setForm({ ...form, variants: newVariants });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sanitizedImages = form.images.filter(img => img !== null && img !== undefined);

        if (!form.name || !form.slug || !form.category) {
            alert('Incomplete Data: Core Identity Fields Required');
            return;
        }

        for (let i = 0; i < form.variants.length; i++) {
            const variant = form.variants[i];
            if (!variant.sku || !variant.size || !variant.color) {
                alert(`Incomplete Variant Data (Index ${i + 1}): SKU, Size, and Color are mandatory.`);
                return;
            }
        }

        const submitData = {
            ...form,
            images: sanitizedImages
        };

        updateMutation.mutate(submitData);
    };

    if (queryLoading) return <div className="p-8 text-center font-black uppercase tracking-widest text-black">Decrypting Product Data...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/products">
                        <Button variant="outline" className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Execute / Edit Product</h1>
                        <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] mt-1">Registry Modification Sequence</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {product && (
                        <a
                            href={`${process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}/product/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" className="rounded-none border-2 border-green-600 text-green-600 h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(22,163,74,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye mr-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                                View / Preview
                            </Button>
                        </a>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending || isLoading}
                        className="rounded-none bg-black text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                        <Save className="mr-2 h-3.5 w-3.5" />
                        Commit / Update Product
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
                {/* Left Column: Core Data */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Identity Module */}
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        <div className="bg-gray-50 border-b-4 border-black p-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Identity / Modification</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product Name</label>
                                    <Input
                                        value={form.name}
                                        onChange={handleNameChange}
                                        placeholder="EX: DARK INDIGO CARGO"
                                        className="rounded-none border-2 border-black font-bold uppercase placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Registry Slug</label>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        placeholder="dark-indigo-cargo"
                                        className="rounded-none border-2 border-black font-mono text-[11px] placeholder:text-gray-300 focus-visible:ring-0 bg-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description / Technical Specs</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-none border-2 border-black p-3 text-xs font-bold uppercase placeholder:text-gray-300 focus-visible:outline-none bg-white transition-all min-h-[120px]"
                                    placeholder="Enter detailed hardware specifications..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variant Module */}
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        <div className="bg-gray-50 border-b-4 border-black p-4 flex justify-between items-center">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Variant / Matrix</h2>
                            <Button
                                type="button"
                                onClick={addVariant}
                                className="h-8 rounded-none bg-black text-white px-4 text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                            >
                                <Plus className="h-3 w-3 mr-1.5" /> Execute / Add Variant
                            </Button>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <th className="px-2 pb-2">SKU</th>
                                        <th className="px-2 pb-2">Size</th>
                                        <th className="px-2 pb-2">Color</th>
                                        <th className="px-2 pb-2">Price</th>
                                        <th className="px-2 pb-2">Stock</th>
                                        <th className="px-2 pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.variants.map((variant, idx) => (
                                        <tr key={idx}>
                                            <td className="p-1">
                                                <input
                                                    value={variant.sku}
                                                    onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                                                    className="w-full bg-white border-2 border-black p-2 text-[10px] font-black uppercase outline-none focus:ring-0"
                                                    placeholder="SKU"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <input
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                                                    className="w-full bg-white border-2 border-black p-2 text-[10px] font-black uppercase outline-none focus:ring-0"
                                                    placeholder="L"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <input
                                                    value={variant.color}
                                                    onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                                                    className="w-full bg-white border-2 border-black p-2 text-[10px] font-black uppercase outline-none focus:ring-0"
                                                    placeholder="BLACK"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => updateVariant(idx, 'price', Number(e.target.value))}
                                                    className="w-full bg-white border-2 border-black p-2 text-[10px] font-black outline-none focus:ring-0"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => updateVariant(idx, 'stock', Number(e.target.value))}
                                                    className="w-full bg-white border-2 border-black p-2 text-[10px] font-black outline-none focus:ring-0"
                                                />
                                            </td>
                                            <td className="p-1">
                                                {form.variants.length > 1 && (
                                                    <Button
                                                        onClick={() => removeVariant(idx)}
                                                        variant="outline"
                                                        className="h-9 w-9 p-0 rounded-none border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(220,38,38,0.1)]"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assets & Config */}
                <div className="space-y-8">
                    {/* Visual Module */}
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        <div className="bg-gray-50 border-b-4 border-black p-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Visual Assets</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div
                                className="relative border-2 border-dashed border-black bg-white aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group"
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
                                    <div className="text-[10px] font-black uppercase animate-pulse">Uploading...</div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Inject Asset</span>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {form.images.map((img, idx) => (
                                    <div key={idx} className="relative group border-2 border-black aspect-square overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black text-white p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Finance & Config */}
                    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        <div className="bg-gray-50 border-b-4 border-black p-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Configuration / Value</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Base Price (BDT)</label>
                                <Input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    className="rounded-none border-2 border-black font-black text-lg h-12 bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Domain / Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-white border-2 border-black rounded-none p-3 text-xs font-black uppercase accent-black outline-none"
                                >
                                    <option value="">Select Domain</option>
                                    {categories?.map((cat: any) => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 border-t-2 border-gray-100 pt-4">
                                <div
                                    onClick={() => setForm({ ...form, isDraft: !form.isDraft })}
                                    className="w-5 h-5 border-2 border-black rounded-none flex items-center justify-center cursor-pointer hover:bg-gray-50 bg-white transition-all shrink-0"
                                >
                                    {form.isDraft && <Plus className="w-3.5 h-3.5 rotate-45" />}
                                </div>
                                <label
                                    onClick={() => setForm({ ...form, isDraft: !form.isDraft })}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer select-none"
                                >
                                    Initialize as Draft Module
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
