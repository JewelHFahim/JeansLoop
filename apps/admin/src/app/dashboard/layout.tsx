'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
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
                <div className="p-8 border-b-4 border-white/10">
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">
                        Admin <br />
                        <span className="text-xl not-italic text-gray-400">Control</span>
                    </h1>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 truncate">{user.email}</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-6 overflow-y-auto">
                    {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/dashboard/products', label: 'Products', icon: Package },
                        { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
                        { href: '/dashboard/users', label: 'Users', icon: Users },
                        { href: '/dashboard/settings/categories', label: 'Categories', icon: LayoutDashboard },
                        { href: '/dashboard/settings/coupons', label: 'Coupons', icon: Ticket },
                    ].map((item) => (
                        <Link href={item.href} key={item.href}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start rounded-none border-2 border-transparent hover:border-white hover:bg-white hover:text-black text-white group transition-all h-12 mb-1"
                            >
                                <item.icon className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t-4 border-white/10">
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
