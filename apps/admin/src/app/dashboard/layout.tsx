'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Ticket, Image, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/');
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-72 bg-black border-r-4 border-black flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.1)]">
                <div className="px-8 py-4 border-b-4 border-white/10">
                    <h1 className="text-2xl font-black tracking-tighter uppercase  leading-none text-white">
                        Admin
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-300 italic truncate">{user.email}</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-6 overflow-y-auto">
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
                            <Link href={item.href} key={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start rounded-none border-2 transition-all h-12 mb-1 group ${
                                        isActive 
                                        ? 'bg-white text-black border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]' 
                                        : 'border-transparent text-white hover:border-white hover:bg-white hover:text-black'
                                    }`}
                                >
                                    <item.icon className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-6 py-2 border-t-4 border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start rounded-none border-2 border-transparent hover:border-red-500 hover:bg-red-500 hover:text-white group transition-all h-12 text-red-400"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-white p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
