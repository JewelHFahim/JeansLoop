'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';

import { use } from 'react';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const addItem = useCartStore((state) => state.addItem);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const response = await productsApi.getBySlug(slug);
            return response.data;
        },
    });

    useEffect(() => {
        if (product?.images?.length > 0) {
            setActiveImage(product.images[0]);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!selectedVariant) {
            alert('Please select a size and color');
            return;
        }

        addItem({
            productId: product._id,
            variantSku: selectedVariant.sku,
            name: product.name,
            price: selectedVariant.price || product.price,
            quantity,
            image: product.images?.[0],
            size: selectedVariant.size,
            color: selectedVariant.color,
        });

        alert('Added to cart!');
    };

    if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

    if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

    return (
        <div className="bg-white min-h-screen py-12 lg:py-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-4">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] overflow-hidden bg-gray-50 border border-gray-100 group">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-300 font-black uppercase tracking-widest text-xs">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images?.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    className={`aspect-square bg-gray-50 border-2 p-2 cursor-pointer transition-all ${activeImage === img ? 'border-black shadow-md' : 'border-gray-100 hover:border-black'}`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="border-b-2 border-black pb-8 mb-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">
                                Premium Collection / {product.category}
                            </p>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-black mb-6">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-2xl font-black text-black">
                                    ৳{(selectedVariant?.price || product.price).toFixed(0)}
                                </p>
                                {product.comparePrice && (
                                    <p className="text-lg text-gray-400 line-through font-bold">
                                        ৳{product.comparePrice.toFixed(0)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Description</h3>
                            <p className="text-gray-800 font-medium leading-relaxed text-sm lg:text-base">
                                {product.description}
                            </p>
                        </div>

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-10 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Select Size & Color</label>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {product.variants.map((variant: any, idx: number) => (
                                            <button
                                                key={`${variant.sku}-${idx}`}
                                                onClick={() => setSelectedVariant(variant)}
                                                disabled={variant.stock === 0}
                                                className={`flex items-center justify-between px-6 py-4 text-[11px] font-black uppercase tracking-widest border-2 transition-all ${selectedVariant?.sku === variant.sku && selectedVariant?.size === variant.size && selectedVariant?.color === variant.color
                                                    ? 'bg-black text-white border-black shadow-xl -translate-y-1'
                                                    : 'bg-white text-black border-gray-100 hover:border-black'
                                                    } ${variant.stock === 0 ? 'opacity-20 cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-lg'}`}
                                            >
                                                <span>{variant.size} - {variant.color}</span>
                                                {variant.stock === 0 ? (
                                                    <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 ml-2">SOLD OUT</span>
                                                ) : variant.stock < 5 ? (
                                                    <span className="text-[8px] bg-black text-white px-2 py-0.5 ml-2">LOW STOCK</span>
                                                ) : null}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedVariant && (
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Unit SKV: {selectedVariant.sku} • {selectedVariant.stock} available in stock
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quantity & Action */}
                        <div className="mt-auto space-y-8">
                            <div className="flex items-center gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Quantity</label>
                                    <div className="flex items-center border-2 border-black inline-flex bg-white">
                                        <button
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-gray-100 transition-colors text-black"
                                        >
                                            -
                                        </button>
                                        <span className="w-14 h-12 flex items-center justify-center font-black text-lg bg-black text-white border-x-2 border-black">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((q) => q + 1)}
                                            className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-gray-100 transition-colors text-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 pt-10">
                                    <Button
                                        size="lg"
                                        className="w-full h-16 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl group"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="mr-3 h-5 w-5 transition-transform group-hover:-rotate-12" />
                                        Add To Bag
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                            {[
                                { label: 'Secure Payment', sub: 'Verified' },
                                { label: 'Free Shipping', sub: 'Over ৳2000' },
                                { label: 'Authentic Gear', sub: '100% Genuine' }
                            ].map((badge, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-black mb-1">{badge.label}</p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{badge.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
