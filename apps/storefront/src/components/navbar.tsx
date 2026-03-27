'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, settingsApi } from '@/lib/api';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesApi.getAll();
            return response.data;
        },
    });

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await settingsApi.get();
            return response.data;
        },
    });

    return (
        <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex flex-col items-start justify-center group gap-0.5">
                    {settings?.logo ? (
                        <div className="h-8 w-auto">
                            <img src={settings.logo} alt={settings.title} className="h-full w-auto object-contain" />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl font-black tracking-tighter uppercase leading-none text-black">
                                {settings?.title || 'JeansLoop'}
                            </div>
                            <span className='hidden sm:block text-[8px] font-medium italic tracking-[0.3em] text-slate-400 uppercase leading-none mt-1'>
                                {settings?.tagline || 'Premium Denim'}
                            </span>
                        </>
                    )}
                </Link>

                <div className="hidden items-center gap-6 md:flex">

                    {categoriesLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                    ) : (
                        categories?.slice(0, 5).map((category: any) => (
                            <Link
                                key={category._id}
                                href={`/shop?category=${category.slug}`}
                                className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))
                    )}

                    <Link href="/shop" className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors">
                        Shop All
                    </Link>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {mounted ? (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/account">
                                        <Button variant="ghost" size="icon" title="Account" className="text-black hover:bg-black/5 rounded-full transition-all hover:scale-110">
                                            <User className="h-5 w-5 sm:h-5 sm:w-5" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        title="Logout"
                                        onClick={logout} 
                                        className="hidden sm:flex text-black hover:bg-red-50 hover:text-red-600 rounded-full transition-all hover:scale-110"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="hidden sm:block">
                                    <Button variant="ghost" size="icon" title="Sign In" className="text-black hover:bg-black/5 rounded-full transition-all hover:scale-110">
                                        <User className="h-5 w-5 sm:h-5 sm:w-5" />
                                    </Button>
                                </Link>
                            )}

                            <Link href="/cart" className="relative ml-1 sm:ml-2">
                                <Button variant="ghost" size="icon" className="text-black hover:bg-black/5 rounded-full transition-all hover:scale-110">
                                    <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black text-[9px] sm:text-[10px] font-black text-white border-2 border-white shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="hidden sm:block">
                                <Button variant="ghost" size="icon" className="text-black rounded-full">
                                    <User className="h-5 w-5 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                            <Link href="/cart" className="relative ml-1 sm:ml-2">
                                <Button variant="ghost" size="icon" className="text-black rounded-full">
                                    <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-black hover:bg-black/5 rounded-full transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-64 bg-white p-6 shadow-xl transition-transform">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="font-bold">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="text-2xl">&times;</button>
                            </div>
                            <nav className="flex flex-col gap-4">
                                <Link href="/shop" className="text-lg font-bold uppercase tracking-widest italic" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                                {categories?.map((category: any) => (
                                    <Link
                                        key={category._id}
                                        href={`/shop?category=${category.slug}`}
                                        className="text-lg font-bold uppercase tracking-widest italic"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                <hr />
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/account" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                                        <button
                                            className="text-left text-lg font-medium text-red-600"
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
