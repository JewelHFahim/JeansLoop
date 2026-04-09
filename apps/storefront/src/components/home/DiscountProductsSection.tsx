'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';

export function DiscountProductsSection() {
    const { data } = useQuery({
        queryKey: ['discount-products'],
        queryFn: async () => {
            const response = await productsApi.getAll({ hasDiscount: true, limit: 12 });
            return response.data;
        },
    });

    const products = data?.products || [];

    if (!products || products.length === 0) return null;

    const bannerImage = '/images/banners/Category_Banner_1.avif';

    return (
        <div className="bg-amber-50 py-12">
            <section className="container mx-auto px-4">
                <div className="flex flex-col gap-8 lg:flex-row items-stretch">

                    {/* Promotional Banner - Left Side */}
                    <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-black lg:w-1/4 group shadow-sm transition-all hover:shadow-xl">

                        {/* Background Image (Mobile Only) */}
                        <div className="absolute inset-0 z-0 block lg:hidden">
                            <img src={bannerImage} alt="Background" className="w-full h-full object-cover opacity-40" />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </div>

                        {/* Desktop pattern */}
                        <div className="absolute inset-0 opacity-[0.06] z-0 hidden lg:block" style={{
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                            backgroundRepeat: 'repeat'
                        }}></div>

                        <div className="relative z-10 flex lg:h-full flex-row lg:flex-col p-4 lg:p-6 items-center lg:items-stretch justify-between gap-4 lg:gap-0">
                            {/* Label */}
                            <div className="shrink-0 flex flex-col items-start justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-amber-400 px-3 py-1 mb-3">
                                        <span className="text-[9px] font-black tracking-[0.3em] text-black uppercase">Limited Time</span>
                                    </div>
                                    <h2 className="text-lg sm:text-xl lg:text-3xl font-black leading-[0.9] text-white tracking-tighter uppercase italic">
                                        Flash
                                        <br className="hidden lg:block" />
                                        Deals
                                        <span className="text-[9px] lg:text-xs font-bold tracking-widest text-amber-400 block mt-1 not-italic">DISCOUNTED ITEMS</span>
                                    </h2>
                                </div>
                                <div className="hidden lg:flex mt-4 items-center gap-2">
                                    <div className="h-px w-4 bg-amber-400"></div>
                                    <span className="font-black text-amber-400 uppercase tracking-widest text-[8px]">Sale Registry</span>
                                </div>
                            </div>

                            {/* Middle Content (desktop) */}
                            <div className="hidden lg:flex flex-1 flex-col justify-center my-4">
                                <p className="text-[11px] text-gray-400 font-medium leading-tight mb-4 line-clamp-3">
                                    Premium products at unbeatable prices. Limited time only.
                                </p>
                                <div className="relative flex-1 min-h-[180px] w-full overflow-hidden border border-gray-700 shadow-sm">
                                    <img
                                        src={bannerImage}
                                        alt="Flash Deals"
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            <div className="shrink-0 lg:mt-2 w-auto lg:w-full">
                                <Link href="/shop?discount=true">
                                    <Button className="w-auto lg:w-full bg-amber-400 hover:bg-amber-300 text-black rounded-none font-black uppercase tracking-widest text-[9px] h-8 lg:h-10 px-3 lg:px-0 transition-all transform hover:scale-105 active:scale-95 border-0">
                                        <span className="block lg:hidden">Shop</span>
                                        <span className="hidden lg:block">Shop All Offers</span>
                                        <ArrowRight className="ml-1 lg:ml-2 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="w-full lg:w-3/4">
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                            {products.slice(0, 8).map((product: any, index: number) => {
                                const isLastItem = index === products.slice(0, 8).length - 1;
                                const showViewMore = isLastItem && products.length >= 8;
                                const href = showViewMore ? `/shop?discount=true` : `/product/${product.slug}`;

                                let badgeText = '';
                                if (product.discountPercentage > 0) {
                                    badgeText = `-${product.discountPercentage}%`;
                                } else if (product.discountAmount > 0) {
                                    badgeText = `-৳${product.discountAmount}`;
                                } else {
                                    badgeText = 'SALE';
                                }

                                const currentPrice = product.discountedPrice || product.price;
                                const originalPrice = product.price;

                                return (
                                    <Link href={href} key={product._id} className="group relative">
                                        <Card className="h-full overflow-hidden rounded-none transition-all duration-500 hover:shadow-2xl bg-white border border-gray-200">
                                            <div className="relative aspect-square overflow-hidden bg-white p-2">
                                                {/* Discount badge */}
                                                {!showViewMore && (
                                                    <div className="absolute top-0 left-0 z-10">
                                                        <span className="bg-amber-400 text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] block">
                                                            {badgeText}
                                                        </span>
                                                    </div>
                                                )}

                                                <img
                                                    src={product.images?.[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                    decoding="async"
                                                />

                                                {/* Last item 'View All' overlay */}
                                                {showViewMore && (
                                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white transition-opacity duration-500 hover:bg-black/95">
                                                        <span className="text-lg font-black uppercase tracking-tighter">View</span>
                                                        <span className="text-lg font-black uppercase tracking-tighter">All</span>
                                                        <div className="mt-4 h-px w-12 bg-white/30"></div>
                                                        <ArrowRight className="mt-4 h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>

                                            <CardContent className="p-4 bg-white border-t border-gray-50">
                                                <div className="flex flex-col items-start gap-1">
                                                    <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 truncate w-full">{product.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-base font-black text-black">৳{currentPrice.toFixed(0)}</span>
                                                        <span className="text-xs font-bold text-gray-400 line-through">৳{originalPrice.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
