'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        price: number;
        comparePrice?: number;
        images: string[];
        category: string;
    };
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.slug}`} className="group h-full">
            <Card className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 shadow-sm bg-white">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                            No Image
                        </div>
                    )}

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded-none bg-black px-6 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
                            View Details
                        </span>
                    </div>
                </div>
                <CardContent className="p-4 bg-white">
                    <h3 className="mb-1 line-clamp-1 font-bold text-black uppercase text-sm tracking-tight">{product.name}</h3>
                    <p className="mb-2 text-[10px] font-medium text-gray-700 uppercase tracking-widest">{product.category}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-base font-black text-black">৳{product.price.toFixed(0)}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs text-gray-500 line-through font-medium">৳{product.comparePrice.toFixed(0)}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
