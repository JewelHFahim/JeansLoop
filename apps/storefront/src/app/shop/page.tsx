'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product/ProductCard';
import { productsApi } from '@/lib/api';
import { ChevronRight, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function ShopContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL-based state
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const page = Number(searchParams.get('page')) || 1;

    // Local UI state
    const [localMinPrice, setLocalMinPrice] = useState(minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setLocalMinPrice(minPrice);
        setLocalMaxPrice(maxPrice);
    }, [minPrice, maxPrice]);

    const { data, isLoading } = useQuery({
        queryKey: ['products', category, sort, minPrice, maxPrice, page],
        queryFn: async () => {
            const response = await productsApi.getAll({
                page,
                limit: 12,
                category: category || undefined,
                sort,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
            });
            return response.data;
        },
    });

    const updateFilters = (updates: Record<string, string | number | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });

        // Reset to page 1 on filter change
        if (!updates.page) params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    };

    const categories = ['JEANS', 'TWILL', 'TROUSER', 'SOCKS', 'SHIRT', 'T-SHIRT'];

    const handlePriceApply = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ minPrice: localMinPrice, maxPrice: localMaxPrice });
    };

    const handleClearFilters = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        router.push(pathname);
    };

    return (
        <div className="min-h-screen bg-white py-12 lg:py-20">
            <div className="container mx-auto px-4">

                {/* Desktop Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-8 mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                            {category || 'All Products'}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-3">
                            Discover Supreme Quality / {category || 'Storewide'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Filter Button (Universal) */}
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-none border-black font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-sm"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>

                        <div className="h-4 w-px bg-gray-200" />

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2">
                            <ArrowUpDown className="h-3 w-3 text-gray-500" />
                            <select
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                value={sort}
                                onChange={(e) => updateFilters({ sort: e.target.value })}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Drawer & Overlay */}
                <>
                    {/* Backdrop */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Drawer */}
                    <aside className={`fixed top-0 left-0 bottom-0 z-60 w-full max-w-sm bg-white p-8 shadow-2xl transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic">Refine Search</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Found {data?.total || 0} Products</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-none hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-12 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
                            {/* Category Filter */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 border-b border-gray-100 pb-3">Categories</h3>
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => { updateFilters({ category: '' }); setIsSidebarOpen(false); }}
                                        className={`text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all text-left ${!category ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        All Products
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { updateFilters({ category: cat }); setIsSidebarOpen(false); }}
                                            className={`text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all text-left ${category === cat ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 border-b border-gray-100 pb-3">Price Range</h3>
                                <form onSubmit={(e) => { handlePriceApply(e); setIsSidebarOpen(false); }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min Price</span>
                                            <Input
                                                type="number"
                                                placeholder="৳ 0"
                                                className="h-12 rounded-none border-gray-200 focus:border-black ring-0 text-sm font-bold"
                                                value={localMinPrice}
                                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Max Price</span>
                                            <Input
                                                type="number"
                                                placeholder="৳ 0"
                                                className="h-12 rounded-none border-gray-200 focus:border-black ring-0 text-sm font-bold"
                                                value={localMaxPrice}
                                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-black text-white rounded-none h-14 text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95">
                                        Apply Range
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Footer in Drawer Overlay */}
                        {(category || minPrice || maxPrice) && (
                            <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-gray-100 bg-gray-50/50">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-none h-12 text-[10px] font-black uppercase tracking-widest transition-all"
                                    onClick={() => { handleClearFilters(); setIsSidebarOpen(false); }}
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </aside>
                </>

                {/* Product Grid - Extended Width */}
                <div className="w-full">
                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-3/4 bg-white border border-gray-50 animate-pulse" />
                            ))}
                        </div>
                    ) : data?.products?.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    Showing <span className="text-black">{data.products.length}</span> of <span className="text-black">{data.total}</span> Products
                                </p>
                                <div className="h-px flex-1 bg-gray-100 ml-8" />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                                {data.products.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.pages > 1 && (
                                <div className="mt-20 flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => updateFilters({ page: page - 1 })}
                                        className="rounded-none border-black font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-black hover:text-white transition-all disabled:opacity-20"
                                    >
                                        Prev
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => updateFilters({ page: p })}
                                                className={`w-12 h-12 text-[10px] font-black transition-all border ${page === p
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-black border-gray-100 hover:border-black'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        disabled={page === data.pages}
                                        onClick={() => updateFilters({ page: page + 1 })}
                                        className="rounded-none border-black font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-black hover:text-white transition-all disabled:opacity-20"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200">
                            <p className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">No products found matching your search.</p>
                            <Button onClick={handleClearFilters} className="bg-black text-white rounded-none font-black uppercase tracking-widest text-[11px] h-12 px-8">
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-40">
                        <div className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                            Loading Shop...
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
