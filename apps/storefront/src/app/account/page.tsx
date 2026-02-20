'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Package,
    Settings,
    LogOut,
    ChevronRight,
    Home,
    ShoppingBag,
    CreditCard,
    MapPin,
    Bell
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, usersApi } from '@/lib/api';

type Tab = 'dashboard' | 'orders' | 'profile' | 'settings';

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => {
            const { data } = await ordersApi.getMyOrders();
            // Sort by newest first
            return data.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        },
        enabled: isAuthenticated,
    });

    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await usersApi.getProfile();
            return data;
        },
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) return null;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'profile', label: 'Profile Details', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-6 mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">My Account</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Member Portal / {user?.name || 'Guest'}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs font-bold text-black uppercase tracking-wider">
                            Welcome back, <span className="underline">{user?.name || 'Guest'}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="flex flex-col space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as Tab)}
                                    className={`flex items-center justify-between p-5 text-sm font-black uppercase tracking-widest transition-all border ${activeTab === item.id
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-100 hover:border-black'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </div>
                                    <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 p-5 text-sm font-black uppercase tracking-widest text-red-600 bg-white border border-gray-100 hover:border-red-600 transition-all mt-4"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'dashboard' && <DashboardView user={user} orders={orders} />}
                        {activeTab === 'orders' && <OrdersView orders={orders} isLoading={isLoadingOrders} router={router} />}
                        {activeTab === 'profile' && <ProfileView profile={profile} isLoading={isLoadingProfile} />}
                        {activeTab === 'settings' && <SettingsView />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardView({ user, orders }: any) {
    const stats = [
        { label: 'Total Orders', value: orders?.length || 0, icon: ShoppingBag },
        { label: 'Account Status', value: 'Active', icon: User },
        { label: 'Saved Addresses', value: 0, icon: MapPin },
        { label: 'Notifications', value: 0, icon: Bell },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="rounded-none border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-black" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black uppercase tracking-tighter">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-none border-black border-2 shadow-2xl bg-black text-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Membership Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-200 text-sm font-medium leading-relaxed">
                            You are currently a <span className="text-white font-bold">SILVER</span> member. Complete 2 more orders to unlock <span className="text-white font-bold">GOLD</span> benefits.
                        </p>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-[60%]" />
                        </div>
                        <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-black uppercase tracking-widest text-[11px] h-12">
                            View Benefits
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders?.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 3).map((order: any) => (
                                    <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="font-bold text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-black'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 font-medium">No recent activity found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function OrdersView({ orders, isLoading, router }: any) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    if (isLoading) return <div className="text-center py-12 font-black uppercase tracking-widest animate-pulse">Loading Orders...</div>;

    const totalPages = Math.ceil((orders?.length || 0) / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = orders?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedOrder(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Order History</h2>
                <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block" />
            </div>

            {paginatedOrders.length > 0 ? (
                <div className="space-y-4">
                    {paginatedOrders.map((order: any) => (
                        <Card key={order._id} className={`rounded-none border-gray-100 shadow-sm transition-all duration-300 ${expandedOrder === order._id ? 'border-black shadow-xl ring-1 ring-black ring-inset' : 'hover:border-black'}`}>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 items-center">
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Date</p>
                                        <p className="font-bold text-sm text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                                        <span className={`inline-block text-[9px] font-black px-3 py-1 uppercase tracking-[0.2em] ${order.status === 'DELIVERED' ? 'bg-black text-white' : 'bg-gray-100 text-black'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
                                        <p className="font-black text-lg text-black">৳{(order.totalAmount || order.totalPrice)?.toFixed(0) || '0'}</p>
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className="rounded-none border-black font-black uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-black hover:text-white transition-all group"
                                        >
                                            {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                            <ChevronRight className={`ml-2 h-3 w-3 transition-transform duration-300 ${expandedOrder === order._id ? '-rotate-90' : 'rotate-90'}`} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Item Thumbnails (shown when collapsed) */}
                                {expandedOrder !== order._id && (
                                    <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex gap-4 overflow-x-auto">
                                        {order.items?.map((item: any, i: number) => (
                                            <div key={i} className="shrink-0 w-12 h-12 bg-white border border-gray-200 p-1">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Expanded Details View */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-300">
                                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            {/* Left: Product List */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 pb-4 border-b border-gray-100">Ordered Items</h4>
                                                {order.items?.map((item: any, i: number) => (
                                                    <div key={i} className="flex gap-6 items-center group">
                                                        <div className="h-24 w-24 shrink-0 bg-gray-50 border border-gray-100 p-2 overflow-hidden">
                                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-sm uppercase tracking-tight text-black mb-1">{item.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Qty: {item.quantity} • ৳{item.price?.toFixed(0)} / pc</p>
                                                        </div>
                                                        <p className="font-black text-base text-black">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Right: Summary & Shipping */}
                                            <div className="lg:col-span-1 space-y-8">
                                                {/* Price Calculation Card */}
                                                <div className="bg-gray-50 p-6 space-y-4 border border-gray-100">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Total Calculation</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600 font-medium">Subtotal</span>
                                                            <span className="font-black text-black">৳{(order.itemsPrice || (order.totalAmount - (order.shippingPrice || 70))).toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600 font-medium">Shipping</span>
                                                            <span className="font-black text-green-600">৳{(order.shippingPrice || 70).toFixed(0)}</span>
                                                        </div>
                                                        <div className="h-px bg-gray-200 my-4" />
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-black uppercase tracking-tighter text-black">Order Total</span>
                                                            <span className="text-2xl font-black text-black">৳{order.totalAmount?.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Method</p>
                                                        <p className="text-xs font-bold text-black uppercase">{order.paymentMethod || 'CASH ON DELIVERY'}</p>
                                                    </div>
                                                </div>

                                                {/* Shipping Info Card */}
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Shipping Address</h4>
                                                    <div className="text-sm space-y-1">
                                                        <p className="font-black uppercase text-black">{order.shippingAddress?.fullName}</p>
                                                        <p className="text-gray-600 font-medium">{order.shippingAddress?.street}</p>
                                                        <p className="text-gray-600 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                        <p className="text-gray-600 font-medium pt-2">Phone: {order.shippingAddress?.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="rounded-none border-black font-black uppercase tracking-widest text-[10px] h-10 px-4 disabled:opacity-30"
                            >
                                Prev
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 text-[10px] font-black transition-all border ${currentPage === page
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-100 hover:border-black'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="rounded-none border-black font-black uppercase tracking-widest text-[10px] h-10 px-4 disabled:opacity-30"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">You haven't placed any orders yet.</p>
                    <Button
                        onClick={() => router.push('/shop')}
                        className="mt-6 bg-black text-white rounded-none font-black uppercase tracking-widest text-[11px] h-12 px-8"
                    >
                        Start Shopping
                    </Button>
                </div>
            )}
        </div>
    );
}

function ProfileView({ profile, isLoading }: any) {
    if (isLoading) return <div className="text-center py-12 font-black uppercase tracking-widest animate-pulse">Loading Profile...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Profile Information</h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Full Name</Label>
                        <Input
                            defaultValue={profile?.name}
                            className="rounded-none border-gray-200 focus:border-black focus:ring-0 h-12 font-medium"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Email Address</Label>
                        <Input
                            defaultValue={profile?.email}
                            disabled
                            className="rounded-none border-gray-100 bg-gray-50 text-gray-400 h-12 font-medium cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button className="bg-black text-white rounded-none font-black uppercase tracking-widest text-[11px] h-14 px-12 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="pt-12 border-t border-gray-100">
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">Security</h3>
                <Button variant="outline" className="rounded-none border-black font-black uppercase tracking-widest text-[11px] h-12 px-8">
                    Change Password
                </Button>
            </div>
        </div>
    );
}

function SettingsView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Account Settings</h2>

            <div className="grid grid-cols-1 gap-6">
                {[
                    { title: 'Email Notifications', desc: 'Receive updates on your orders and promotions.', enabled: true },
                    { title: 'Sms Alerts', desc: 'Get shipping status sent directly to your phone.', enabled: false },
                    { title: 'Marketing Preferences', desc: 'Allow us to send you tailored product recommendations.', enabled: true },
                ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all">
                        <div>
                            <p className="font-black uppercase tracking-tighter text-lg text-black">{setting.title}</p>
                            <p className="text-xs text-gray-700 font-medium">{setting.desc}</p>
                        </div>
                        <div className={`h-6 w-11 rounded-full p-1 transition-colors cursor-pointer ${setting.enabled ? 'bg-black' : 'bg-gray-200'}`}>
                            <div className={`h-4 w-4 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
