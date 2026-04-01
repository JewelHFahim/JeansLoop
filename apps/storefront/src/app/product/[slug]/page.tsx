'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

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
        if (product) {
            if (product.images?.length > 0) {
                setActiveImage(product.images[0]);
            }
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'ViewContent', {
                    content_name: product.name,
                    content_ids: [product._id],
                    content_type: 'product',
                    content_category: product.category,
                    value: product.price,
                    currency: 'BDT',
                });
            }
        }
    }, [product]);

    const nextImage = () => {
        if (!product?.images?.length) return;
        const currentIndex = product.images.indexOf(activeImage!);
        const nextIndex = (currentIndex + 1) % product.images.length;
        setActiveImage(product.images[nextIndex]);
    };

    const prevImage = () => {
        if (!product?.images?.length) return;
        const currentIndex = product.images.indexOf(activeImage!);
        const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        setActiveImage(product.images[prevIndex]);
    };

    const handleAddToCart = () => {
        if (product.variants.length > 0 && !selectedVariant) { // Modified condition to use selectedVariant
            toast.error('Please select a size');
            return;
        }

        const item = { // Define item before passing to addItem
            productId: product._id,
            variantSku: selectedVariant.sku,
            name: product.name,
            price: selectedVariant.price || product.price,
            quantity,
            image: product.images?.[0],
            size: selectedVariant.size,
            color: selectedVariant.color,
        };
        addItem(item);

        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'AddToCart', {
                content_name: item.name,
                content_ids: [item.productId],
                content_type: 'product',
                value: item.price * item.quantity,
                currency: 'BDT',
                contents: [{ id: item.productId, quantity: item.quantity }]
            });
        }

        toast.success('Added to cart!');
    };

    if (isLoading) return <Loader variant="page" text="DECRYPTING_ASSET_PROTOCOLS" />;

    if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

    return (
        <div className="bg-white min-h-screen py-12 lg:py-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-4">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-4/5 overflow-hidden bg-gray-50 border border-gray-100 group cursor-crosshair">
                            {/* Technical Counter */}
                            <div className="absolute top-6 left-6 z-10 bg-black text-white px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-elegant-pulse" />
                                PHOTO_ID / {(product.images?.indexOf(activeImage!) ?? 0) + 1} / {product.images?.length || 0}
                            </div>

                            {/* Nav Arrows */}
                            {product.images?.length > 1 && (
                                <div className="absolute inset-0 z-20 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={prevImage}
                                        className="w-12 h-12 bg-white/40 backdrop-blur-md border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all ml-6 pointer-events-auto transform hover:scale-110 active:scale-95"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="w-12 h-12 bg-white/40 backdrop-blur-md border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all mr-6 pointer-events-auto transform hover:scale-110 active:scale-95"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            )}

                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-1000 group-hover:scale-105"
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
                        <div className="border-b-2 border-black pb-4 mb-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">
                                Premium Collection / {product.category}
                            </p>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-black mb-2">
                                {product.name}
                            </h1>
                            {product.variants?.[0]?.color && (
                                <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 block">
                                    COLOR: <span className="text-black">{product.variants[0].color}</span>
                                </p>
                            )}
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
                            <p className="text-gray-800 font-medium leading-relaxed text-sm lg:text-base whitespace-pre-line">
                                {product.description}
                            </p>

                            {product.highlights && product.highlights.length > 0 && (
                                <ul className="mt-4 space-y-2">
                                    {product.highlights.map((point: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-800 font-medium">
                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Size Chart */}
                        {product.sizeChart && product.sizeChart.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Measurement / Size Chart</h3>
                                <div className="border-2 border-black overflow-x-auto bg-white">
                                    <table className="w-full text-left text-sm font-medium">
                                        <thead className="bg-gray-50 border-b-2 border-black">
                                            <tr>
                                                <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px] border-r-2 border-black">Waist</th>
                                                <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px] border-r-2 border-black">Thigh</th>
                                                <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px] border-r-2 border-black">Leg Opening</th>
                                                <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px]">Long</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black">
                                            {product.sizeChart.map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 border-r-2 border-black">{row.waist}</td>
                                                    <td className="px-4 py-3 border-r-2 border-black">{row.thigh}</td>
                                                    <td className="px-4 py-3 border-r-2 border-black">{row.legOpening}</td>
                                                    <td className="px-4 py-3">{row.long}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-10 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Select Size</label>
                                    <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                                        {product.variants.map((variant: any, idx: number) => (
                                            <button
                                                key={`${variant.sku}-${idx}`}
                                                onClick={() => setSelectedVariant(variant)}
                                                disabled={variant.stock === 0}
                                                className={`flex flex-col items-center justify-center p-3 text-[11px] font-black uppercase tracking-widest border-2 transition-all ${selectedVariant?.sku === variant.sku && selectedVariant?.size === variant.size
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-black border-gray-100 hover:border-black'
                                                    } ${variant.stock === 0 ? 'opacity-20 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                                            >
                                                <span>{variant.size}</span>
                                                {variant.stock === 0 ? (
                                                    <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 mt-1">SOLD OUT</span>
                                                ) : variant.stock < 5 ? (
                                                    <span className="text-[8px] bg-black text-white px-2 py-0.5 mt-1">LOW STOCK</span>
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
                        <div className="mt-auto space-y-6 sm:space-y-8">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Quantity</label>
                                    <div className="inline-flex items-center border-2 border-black bg-white">
                                        <button
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="w-12 h-14 sm:h-12 flex items-center justify-center font-black text-xl hover:bg-gray-100 transition-colors text-black"
                                        >
                                            -
                                        </button>
                                        <span className="w-14 h-14 sm:h-12 flex items-center justify-center font-black text-lg bg-black text-white border-x-2 border-black">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((q) => q + 1)}
                                            className="w-12 h-14 sm:h-12 flex items-center justify-center font-black text-xl hover:bg-gray-100 transition-colors text-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 sm:pt-9">
                                    <Button
                                        size="lg"
                                        className="w-full h-14 sm:h-16 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl group flex items-center justify-center"
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
                                { label: 'Free Shipping', sub: 'Over ৳2500' },
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
