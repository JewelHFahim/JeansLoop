'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryPromoSectionProps {
    category: string;
    title: string;
    subtitle: string;
    description: string;
    bannerImage: string;
    products: any[];
    topLabel?: string;
}

export function CategoryPromoSection({
    category,
    title,
    subtitle,
    description,
    bannerImage,
    products,
    topLabel = "Supreme Quality"
}: CategoryPromoSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8 lg:flex-row items-stretch">
                {/* Promotional Banner - Left Side (1 col) */}
                <div className="relative flex w-full flex-col overflow-hidden rounded-none bg-white border border-gray-200 lg:w-1/4 group shadow-sm transition-all hover:shadow-xl">
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                        backgroundRepeat: 'repeat'
                    }}></div>

                    <div className="relative z-10 flex h-full flex-col p-6 justify-between">
                        {/* Header/Title */}
                        <div className="shrink-0">
                            <h3 className="text-[9px] font-black tracking-[0.3em] text-gray-600 uppercase mb-2">{topLabel}</h3>
                            <h2 className="text-3xl font-black leading-[0.9] text-black tracking-tighter uppercase italic">
                                {title} <br />
                                <span className="text-xs font-bold tracking-widest text-gray-700 block mt-1 not-italic">{subtitle}</span>
                            </h2>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-px w-4 bg-black"></div>
                                <span className="font-black text-black uppercase tracking-widest text-[8px]">Medical Grade Protection</span>
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div className="flex flex-1 flex-col justify-center my-4">
                            <p className="text-[11px] text-gray-600 font-medium leading-tight mb-4 line-clamp-2">
                                {description}
                            </p>
                            <div className="relative flex-1 min-h-[180px] w-full overflow-hidden border border-gray-100 shadow-sm">
                                <img
                                    src={bannerImage}
                                    alt={`${title} Preview`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Footer / CTA */}
                        <div className="shrink-0 mt-2">
                            <Link href={`/shop?category=${category}`}>
                                <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-none font-black uppercase tracking-widest text-[9px] h-10 transition-all transform hover:scale-105 active:scale-95">
                                    Shop Collection <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Product Grid - Right Side (3 cols) */}
                <div className="w-full lg:w-3/4">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 h-full">
                        {products.slice(0, 8).map((product, index) => (
                            <Link href={`/shop?category=${category}`} key={product._id} className="group relative">
                                <Card className="h-full overflow-hidden rounded-none transition-all duration-500 hover:shadow-2xl bg-white border border-gray-200 flex flex-col">
                                    <div className="relative aspect-square overflow-hidden bg-white p-2">
                                        {/* Badge */}
                                        <div className="absolute top-0 left-0 z-10">
                                            <span className="bg-black text-white text-[9px] font-black px-4 py-2 uppercase tracking-[0.2em]">
                                                {index % 2 === 0 ? 'NEW' : 'LTD ED.'}
                                            </span>
                                        </div>

                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Last item 'View More' overlay */}
                                        {index === products.slice(0, 8).length - 1 && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 text-white transition-opacity duration-500">
                                                <span className="text-2xl font-black uppercase tracking-tighter">View</span>
                                                <span className="text-2xl font-black uppercase tracking-tighter">More</span>
                                                <div className="mt-4 h-px w-12 bg-white/30"></div>
                                                <ArrowRight className="mt-4 h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-4 bg-white border-t border-gray-50 flex-1 flex flex-col justify-between">
                                        <div className="flex flex-col items-start gap-1">
                                            <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 truncate w-full">{product.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-black text-black">৳{product.price?.toFixed(0) || '0'}</span>
                                                <span className="text-xs font-bold text-gray-300 line-through">৳{(product.price * 1.4).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
