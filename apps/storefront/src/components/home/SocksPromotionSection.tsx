'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


interface SocksPromotionSectionProps {
    category: string;
    title: string;
    subtitle: string;
    description: string;
    bannerImage: string;
    products: any[];
}

export function SocksPromotionSection({
    category,
    title,
    subtitle,
    description,
    bannerImage,
    products
}: SocksPromotionSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="container mx-auto px-4">
            <div className="flex flex-col gap-8 lg:flex-row items-stretch">
                {/* Promotional Banner - Left Side (1 col) */}
                <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-white border border-gray-200 lg:w-1/4 group shadow-sm transition-all hover:shadow-xl">
                    <div className="absolute inset-0 opacity-[0.03] z-0 hidden lg:block" style={{
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                        backgroundRepeat: 'repeat'
                    }}></div>

                    {/* Background Image (Mobile Only) */}
                    <div className="absolute inset-0 z-0 block lg:hidden">
                        <img src={bannerImage} alt="Background" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-black/80"></div>
                    </div>

                    <div className="relative z-10 flex lg:h-full flex-row lg:flex-col p-4 lg:p-6 items-center lg:items-stretch justify-between gap-4 lg:gap-0">
                        {/* Header/Title */}
                        <div className="shrink-0 flex flex-col items-start justify-between">
                            <div>
                                <h3 className="hidden lg:block text-[9px] font-black tracking-[0.3em] text-gray-600 uppercase mb-2">Supreme Quality</h3>
                                <h2 className="text-lg sm:text-xl lg:text-3xl font-black leading-[0.9] text-white lg:text-black tracking-tighter uppercase italic">
                                    {title}
                                    <span className="text-[9px] lg:text-xs font-bold tracking-widest text-gray-300 lg:text-gray-700 block mt-1 not-italic">{subtitle}</span>
                                </h2>
                            </div>
                            <div className="hidden lg:flex mt-4 items-center gap-2">
                                <div className="h-px w-4 bg-black"></div>
                                <span className="font-black text-black uppercase tracking-widest text-[8px]">Registry / {category}</span>
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div className="hidden lg:flex flex-1 flex-col justify-center my-4">
                            <p className="text-[11px] text-gray-600 font-medium leading-tight mb-4 line-clamp-2">
                                {description}
                            </p>
                            <div className="relative flex-1 min-h-0 w-full overflow-hidden border border-gray-100 shadow-sm">
                                <img
                                    src={bannerImage}
                                    alt={`${title} Preview`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        <div className="shrink-0 lg:mt-2 w-auto lg:w-full">
                            <Link href={`/shop?category=${category}`}>
                                <Button className="w-auto lg:w-full bg-white/10 backdrop-blur-md lg:bg-black text-white lg:text-white border-2 border-white/30 lg:border-transparent hover:bg-white/20 lg:hover:bg-gray-800 rounded-none font-black uppercase tracking-widest text-[9px] h-8 lg:h-10 px-3 lg:px-0 transition-all transform hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] lg:shadow-none hover:shadow-none">
                                    <span className="block lg:hidden">Shop</span>
                                    <span className="hidden lg:block">Shop Collection</span> 
                                    <ArrowRight className="ml-1 lg:ml-2 h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Product Grid - Right Side (3 cols) */}
                <div className="w-full lg:w-3/4">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                        {products.slice(0, 8).map((sock, index) => {
                            const isLastItem = index === products.slice(0, 8).length - 1;
                            const showViewMore = isLastItem && products.length >= 8;
                            const href = showViewMore ? `/shop?category=${category}` : `/product/${sock.slug}`;

                            return (
                            <Link href={href} key={sock._id} className="group relative">
                                <Card className="h-full overflow-hidden rounded-none transition-all duration-500 hover:shadow-2xl bg-white border border-gray-200">
                                    <div className="relative aspect-square overflow-hidden bg-white p-2">
                                        {/* Badge */}
                                        {!showViewMore && (
                                            <div className="absolute top-0 left-0 z-10">
                                                <span className="bg-black text-white text-[9px] font-black px-4 py-2 uppercase tracking-[0.2em]">
                                                    {index % 2 === 0 ? 'NEW' : 'LTD ED.'}
                                                </span>
                                            </div>
                                        )}

                                        <img
                                            src={sock.images?.[0]}
                                            alt={sock.name}
                                            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        {/* Last item 'View More' overlay */}
                                        {showViewMore && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white transition-opacity duration-500 hover:bg-black/95">
                                                <span className="text-lg font-black uppercase tracking-tighter">View</span>
                                                <span className="text-lg font-black uppercase tracking-tighter">More</span>
                                                <div className="mt-4 h-px w-12 bg-white/30"></div>
                                                <ArrowRight className="mt-4 h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-4 bg-white border-t border-gray-50">
                                        <div className="flex flex-col items-start gap-1">
                                            <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 truncate w-full">{sock.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-black text-black">৳{sock.price?.toFixed(0) || '0'}</span>
                                                {sock.comparePrice && sock.comparePrice > sock.price && (
                                                    <span className="text-xs font-bold text-gray-300 line-through">৳{sock.comparePrice.toFixed(0)}</span>
                                                )}
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
    );
}
