'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, LogOut, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);



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
                                {settings?.title || 'Fire Cutter'}
                            </div>
                            <span className='hidden sm:block text-[8px] font-medium italic tracking-[0.3em] text-slate-400 uppercase leading-none mt-1'>
                                {settings?.tagline || 'Premium Denim'}
                            </span>
                        </>
                    )}
                </Link>

                <div className="hidden items-center gap-6 md:flex">

                    <Link href="/shop?category=jeans" className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors">
                        JEANS
                    </Link>
                    <Link href="/shop?category=twill" className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors">
                        twill
                    </Link>
                    <Link href="/shop?category=trouser" className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors">
                        TROUSER
                    </Link>
                    <Link href="/shop?category=denim" className="text-black font-bold uppercase tracking-widest text-[12px] hover:text-gray-600 transition-colors">
                        Denim
                    </Link>

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
                <div className="fixed inset-0 z-100 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setIsMenuOpen(false)} 
                    />
                    
                    {/* Drawer Panel */}
                    <div className="fixed inset-y-0 right-0 w-[85vw] max-w-sm bg-white border-l-4 border-black shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-black text-white">
                            <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">{settings?.title || 'Fire Cutter'}</span>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="p-2 hover:bg-white/20 rounded-none transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                            <div className="space-y-2 mb-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 pb-2 border-b border-gray-100">Shop Navigation</p>
                                
                                <Link 
                                    href="/shop" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group p-3 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gray-50 hover:bg-white"
                                >
                                    <span className="text-base font-black uppercase italic tracking-widest text-black">Shop All</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link 
                                    href="/shop?category=jeans" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group p-3 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gray-50 hover:bg-white"
                                >
                                    <span className="text-base font-black uppercase italic tracking-widest text-black">JEANS</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link 
                                    href="/shop?category=twill" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group p-3 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gray-50 hover:bg-white"
                                >
                                    <span className="text-base font-black uppercase italic tracking-widest text-black">twill</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link 
                                    href="/shop?category=trouser" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group p-3 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gray-50 hover:bg-white"
                                >
                                    <span className="text-base font-black uppercase italic tracking-widest text-black">TROUSER</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link 
                                    href="/shop?category=denim" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group p-3 border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gray-50 hover:bg-white"
                                >
                                    <span className="text-base font-black uppercase italic tracking-widest text-black">Denim</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Drawer Footer (Auth) */}
                        <div className="p-4 border-t-4 border-black bg-gray-50 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 truncate text-center mb-3">
                                        Signed In • {user?.email}
                                    </p>
                                    <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full h-12 bg-black text-white hover:bg-gray-900 rounded-none font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                            <User className="w-4 h-4 mr-2" /> My Account
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        variant="outline"
                                        className="w-full h-12 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded-none font-black uppercase tracking-widest transition-all mt-2"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full h-12 bg-black text-white hover:bg-gray-900 rounded-none font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                            Sign In / Register
                                        </Button>
                                    </Link>
                                    <div className="text-center mt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Guest browsing session
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
