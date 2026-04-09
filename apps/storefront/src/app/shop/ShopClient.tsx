'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product/ProductCard';
import { productsApi, categoriesApi } from '@/lib/api';
import { X, SlidersHorizontal, ArrowUpDown, Loader2 } from 'lucide-react';

export function ShopClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL-based state
    const category = searchParams.get('category') || '';
    const discount = searchParams.get('discount') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const size = searchParams.get('size') || '';
    const page = Number(searchParams.get('page')) || 1;

    // Local UI state
    const [localMinPrice, setLocalMinPrice] = useState(minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setLocalMinPrice(minPrice);
        setLocalMaxPrice(maxPrice);
    }, [minPrice, maxPrice]);

    const { data, isLoading } = useQuery({
        queryKey: ['products', category, discount, sort, minPrice, maxPrice, page, size],
        queryFn: async () => {
            const response = await productsApi.getAll({
                page,
                limit: 12,
                category: category || undefined,
                hasDiscount: discount === 'true' ? true : undefined,
                sort,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                size: size || undefined,
            });
            return response.data;
        },
    });

    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
    });

    const categories = categoriesResponse || [];

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

    const sizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'];

    const handlePriceApply = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ minPrice: localMinPrice, maxPrice: localMaxPrice });
    };

    const handleClearFilters = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        router.push(pathname);
    };

    // Heading label for current filter state
    const pageTitle = discount === 'true' ? 'On Sale' : (category || 'All Products');
    const pageSubtitle = discount === 'true' ? 'Discounted Items' : (category || 'Storewide');

    return (
        <div className="min-h-screen bg-white py-12 lg:py-20">
            <div className="container mx-auto px-4">

                {/* Desktop Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-8 mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                            {pageTitle}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-3">
                            Discover Supreme Quality / {pageSubtitle}
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
                    <aside className={`fixed top-0 left-0 bottom-0 z-100 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b-2 border-black bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-tight">Refine / Filter</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-elegant-pulse" />
                                    Found {data?.total || 0} Assets
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-none w-12 h-12 hover:bg-black hover:text-white transition-all group" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {/* Category Filter */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 w-full">01 / Category</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => { updateFilters({ category: '', discount: '' }); setIsSidebarOpen(false); }}
                                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-3 transition-all text-center border-2 ${!category && !discount ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-black border-gray-100 hover:border-black hover:bg-gray-50'}`}
                                    >
                                        All Assets
                                    </button>

                                    {/* On Sale - hardcoded, not a real DB category */}
                                    <button
                                        onClick={() => { updateFilters({ category: '', discount: 'true' }); setIsSidebarOpen(false); }}
                                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-3 transition-all text-center border-2 ${
                                            discount === 'true'
                                                ? 'bg-amber-400 text-black border-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                                                : 'bg-white text-black border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                                        }`}
                                    >
                                        🏷 On Sale
                                    </button>

                                    {!mounted || isCategoriesLoading ? (
                                        <div className="flex items-center justify-center p-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                                        </div>
                                    ) : (
                                        categories.map((cat: any) => (
                                            <button
                                                key={cat._id}
                                                onClick={() => { updateFilters({ category: cat.slug, discount: '' }); setIsSidebarOpen(false); }}
                                                className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-3 transition-all text-center border-2 ${category?.toUpperCase() === cat.slug?.toUpperCase() ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-black border-gray-100 hover:border-black hover:bg-gray-50'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 w-full">02 / Available Sizes</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { updateFilters({ size: size === s ? '' : s }); setIsSidebarOpen(false); }}
                                            className={`h-10 flex items-center justify-center text-[10px] font-black border-2 transition-all ${size === s ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]' : 'bg-white text-black border-gray-100 hover:border-black'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b border-gray-100 pb-2 w-full">03 / Price Range</h3>
                                <form onSubmit={(e) => { handlePriceApply(e); setIsSidebarOpen(false); }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min (BDT)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-black">৳</span>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full h-12 pl-8 pr-3 border-2 border-gray-100 focus:border-black outline-none transition-all text-xs font-black"
                                                    value={localMinPrice}
                                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Max (BDT)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-black">৳</span>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full h-12 pl-8 pr-3 border-2 border-gray-100 focus:border-black outline-none transition-all text-xs font-black"
                                                    value={localMaxPrice}
                                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-black text-white rounded-none h-12 text-[9px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                                        Execute Range
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Footer - Fixed at bottom */}
                        <div className="p-6 border-t-2 border-black bg-gray-50 flex flex-col gap-3">
                            {(category || discount || minPrice || maxPrice || size) ? (
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-none h-12 text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-[3px_3px_0px_0px_rgba(220,38,38,0.1)]"
                                    onClick={() => { handleClearFilters(); setIsSidebarOpen(false); }}
                                >
                                    Purge All Filters
                                </Button>
                            ) : (
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] text-center italic">
                                    No active filters detected
                                </p>
                            )}
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center">
                                Fire Cutter / Nexus Protocol v2.1
                            </p>
                        </div>
                    </aside>
                </>

                {/* Product Grid - Extended Width */}
                <div className="w-full">
                    {!mounted || isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-3/4 bg-white border border-gray-50 animate-pulse" />
                            ))}
                        </div>
                    ) : (data?.products ?? []).length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    Showing <span className="text-black">{data?.products.length}</span> of <span className="text-black">{data?.total}</span> Products
                                </p>
                                <div className="h-px flex-1 bg-gray-100 ml-8" />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                                {data?.products.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {(data?.pages ?? 0) > 1 && (
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
                                        {Array.from({ length: data?.pages ?? 0 }, (_, i) => i + 1).map((p) => (
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
                                        disabled={page === data?.pages}
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
