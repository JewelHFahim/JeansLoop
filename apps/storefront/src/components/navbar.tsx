'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-2xl font-bold text-black flex flex-col items-center">
                    Fire Cutter
                    <span className='text-xs font-thin tracking-widest text-slate-500'>Export Collections</span>
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    <Link href="/shop" className="text-black hover:text-gray-600">
                        Shop
                    </Link>
                    <Link href="/shop?category=JEANS" className="text-black hover:text-gray-600">
                        Jeans
                    </Link>
                    <Link href="/shop?category=TWILL" className="text-black hover:text-gray-600">
                        Twill
                    </Link>
                    <Link href="/shop?category=TROUSER" className="text-black hover:text-gray-600">
                        Trouser
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {mounted ? (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/account">
                                        <Button variant="ghost" size="icon" title="Account" className="text-black hover:bg-black/5 rounded-full transition-all hover:scale-110">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={logout} className="text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white rounded-none border border-black px-4 transition-all">
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm" className="text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white rounded-none border border-black px-4 transition-all">
                                        Sign In
                                    </Button>
                                </Link>
                            )}

                            <Link href="/cart" className="relative ml-2">
                                <Button variant="ghost" size="icon" className="text-black hover:bg-black/5 rounded-full transition-all hover:scale-110">
                                    <ShoppingCart className="h-5 w-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white border-2 border-white shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm" className="text-black font-bold">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/cart" className="relative ml-2">
                                <Button variant="ghost" size="icon" className="text-black">
                                    <ShoppingCart className="h-5 w-5" />
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
                        <Menu className="h-6 w-6" />
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
                                <Link href="/shop" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                                <Link href="/shop?category=JEANS" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Jeans</Link>
                                <Link href="/shop?category=TWILL" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Twill</Link>
                                <Link href="/shop?category=TROUSER" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Trouser</Link>
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
