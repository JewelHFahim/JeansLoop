'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Ticket, Image, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/');
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white z-40">
                <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-black">
                    Fire Cutter
                </h1>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none border-2 border-black h-10 w-10 flex items-center justify-center p-0"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-black border-r-4 border-black flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:flex
            `}>
                <div className="px-8 py-6 border-b-4 border-white/10 hidden lg:block">
                    <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-white italic">
                        Fire Cutter
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-400 italic truncate">{user.email}</span>
                    </div>
                </div>

                <div className="px-8 py-6 border-b-4 border-white/10 lg:hidden flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-white italic">
                        Menu
                    </h1>
                    <Button variant="ghost" className="text-white hover:text-red-500 p-0" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-2 p-6 overflow-y-auto custom-scrollbar">
                    {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/dashboard/products', label: 'Products', icon: Package },
                        { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
                        { href: '/dashboard/users', label: 'Users', icon: Users },
                        { href: '/dashboard/sliders', label: 'Hero Sliders', icon: Image },
                        { href: '/dashboard/settings/categories', label: 'Categories', icon: LayoutDashboard },
                        { href: '/dashboard/settings/coupons', label: 'Coupons', icon: Ticket },
                        { href: '/dashboard/settings/site', label: 'Site Settings', icon: Globe },
                    ].map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link href={item.href} key={item.href} className="block group">
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start rounded-none border-2 transition-all h-12 mb-1 ${
                                        isActive 
                                        ? 'bg-white text-black border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]' 
                                        : 'border-transparent text-white hover:border-white hover:bg-white/10'
                                    }`}
                                >
                                    <item.icon className={`mr-3 h-4 w-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-6 py-4 border-t-4 border-white/10">
                    <div className="mb-4 lg:hidden">
                       <p className="text-[10px] font-black text-gray-400 italic truncate mb-4">{user.email}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start rounded-none border-2 border-transparent hover:border-red-600 hover:bg-red-600 hover:text-white group transition-all h-12 text-red-500 font-black uppercase tracking-widest text-[11px]"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Terminate / Session
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-12 custom-scrollbar relative">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
                
                {/* Footer credit only on mobile if sidebar is closed */}
                <div className="lg:hidden mt-20 pt-8 border-t border-gray-100 pb-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Fire Cutter Internal Portal</p>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e5e5;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #000000;
                }
            `}</style>
        </div>
    );
}
