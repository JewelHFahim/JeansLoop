'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';

interface FeaturedCategoryProps {
    title: string;
    description?: string;
    link: string;
    bannerImage: string;
    products: any[];
    reversed?: boolean; // Option to put banner on right?
}

export function FeaturedCategory({
    title,
    description,
    link,
    bannerImage,
    products,
    reversed = false,
}: FeaturedCategoryProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className={`flex flex-col gap-8 lg:flex-row ${reversed ? 'lg:flex-row-reverse' : ''}`}>

                {/* Banner Section - 1/3 width on desktop */}
                <div className="relative flex min-h-[400px] w-full flex-col justify-between overflow-hidden rounded-none bg-black p-8 text-white lg:w-1/3 xl:w-1/4">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={bannerImage}
                            alt={title}
                            className="h-full w-full object-cover opacity-70 transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="mb-2 text-4xl font-black uppercase tracking-tighter">{title}</h2>
                        {description && <p className="mb-6 text-sm text-gray-100 font-medium leading-relaxed">{description}</p>}
                        <Link href={link}>
                            <Button className="w-full bg-white text-black hover:bg-gray-200 sm:w-auto rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8">
                                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Product Grid - 2/3 width on desktop */}
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
