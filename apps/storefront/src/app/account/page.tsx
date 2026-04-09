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
    Bell,
    Phone,
    Mail,
    Calendar,
    User2,
    CheckCircle2,
    Loader2,
    X,
    Clock,
    Truck,
    ShieldCheck,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, usersApi } from '@/lib/api';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'orders' | 'profile' | 'security';

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, isInitialized, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    // Redirect if not authenticated, but only after initialization
    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isInitialized, router]);

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

    if (!isInitialized) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest animate-pulse">Initializing Security Protocol...</div>;
    if (!isAuthenticated) return null;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'profile', label: 'Profile Details', icon: User },
        { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
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
                        {activeTab === 'dashboard' && <DashboardView user={user} orders={orders} setActiveTab={setActiveTab} router={router} />}
                        {activeTab === 'orders' && <OrdersView orders={orders} isLoading={isLoadingOrders} router={router} />}
                        {activeTab === 'profile' && <ProfileView profile={profile} isLoading={isLoadingProfile} />}
                        {activeTab === 'security' && <SecurityView />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardView({ user, orders, setActiveTab, router }: any) {
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <Card className="lg:col-span-2 rounded-none border-gray-200 shadow-sm overflow-hidden flex flex-col h-full bg-white">
                    <CardHeader className="border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Recent Activity</CardTitle>
                            <Button variant="link" onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-black hover:no-underline hover:opacity-70 transition-all p-0 h-auto">
                                View All Orders
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        {orders?.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {orders.slice(0, 3).map((order: any) => (
                                    <div key={order._id} className="flex items-center justify-between p-5 hover:bg-gray-50/30 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-[10px] rounded-none group-hover:scale-105 transition-transform">
                                                #{order._id.slice(-4).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase tracking-tight">Order Initiated</p>
                                                <p className="text-[10px] font-medium text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-sm mb-1">৳{order.totalAmount?.toFixed(0)}</p>
                                            <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'bg-black text-white border-black' :
                                                order.status === 'CANCELLED' || order.status === 'RETURNED' ? 'bg-red-600 text-white border-red-600' :
                                                    'bg-gray-100 text-black border-gray-200'
                                                }`}>
                                                {order.status === 'COURIERED' ? 'IN TRANSIT' : order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-gray-200" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Activity Feed is Empty</p>
                                <Button onClick={() => router.push('/shop')} variant="outline" className="mt-4 rounded-none border-black text-[10px] font-black uppercase tracking-widest h-10 px-6">
                                    Browse Collection
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="lg:col-span-1 flex flex-col gap-8">
                    <Card className="rounded-none border-black border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white shrink-0">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Account Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-black">
                            <p className="text-gray-600 text-[11px] font-medium leading-relaxed uppercase tracking-wide">
                                Keep your digital assets protected. Update your security protocols regularly.
                            </p>
                            <div className="space-y-2">
                                <Button onClick={() => setActiveTab('profile')} className="w-full bg-black text-white hover:bg-gray-800 rounded-none font-black uppercase tracking-widest text-[10px] h-11 transition-all">
                                    Update Profile
                                </Button>
                                <Button onClick={() => setActiveTab('security')} variant="outline" className="w-full border-black text-black hover:bg-gray-50 rounded-none font-black uppercase tracking-widest text-[10px] h-11 transition-all">
                                    Security Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-gray-100 bg-gray-50/50 p-6 flex flex-col items-center text-center flex-1 justify-center">
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-4 rounded-none rotate-3">
                            <Home className="w-5 h-5 text-black" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-2">Need Assistance?</h4>
                        <p className="text-[11px] font-medium text-gray-500 mb-4 px-4 line-clamp-2">
                            Connect with our specialized support terminal for order inquiries.
                        </p>
                        <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-black underline p-0 h-auto">
                            Customer Terminal
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function OrdersView({ orders, isLoading, router }: any) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

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
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 px-6 py-5 items-center">
                                    <div className="md:col-span-2 flex items-center gap-5">
                                        <div className="flex -space-x-5 overflow-hidden shrink-0 group-hover:space-x-1 transition-all">
                                            {order.items?.slice(0, 3).map((item: any, i: number) => (
                                                <div key={i} className="w-12 h-12 bg-white border-2 border-white shadow-md ring-1 ring-gray-100 p-1 relative z-10 group-hover:z-20">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-[10px] border-2 border-white shadow-md ring-1 ring-gray-100 z-5">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Detail</p>
                                            <p className="font-black text-sm text-black truncate tracking-tighter">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                                        <p className="font-black text-lg text-black">৳{(order.totalAmount || order.totalPrice)?.toFixed(0)}</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Method</p>
                                        <p className="text-[11px] font-black text-black uppercase tracking-widest truncate">{order.paymentMethod || 'COD'}</p>
                                    </div>
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                                        <span className={`inline-block text-[9px] font-black px-3 py-1 uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'bg-black text-white border-black' :
                                            order.status === 'CANCELLED' || order.status === 'RETURNED' ? 'bg-red-600 text-white border-red-700' :
                                                'bg-gray-100 text-black border-gray-200'
                                            }`}>
                                            {order.status === 'COURIERED' ? 'IN TRANSIT' : order.status}
                                        </span>
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-end gap-2 text-black">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className="rounded-none border-2 border-black font-black uppercase tracking-widest text-[10px] h-11 px-6 hover:bg-black hover:text-white transition-all group shrink-0"
                                        >
                                            {expandedOrder === order._id ? 'Close' : 'Details'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Modern Order Details Modal */}
                    {expandedOrder && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
                                onClick={() => setExpandedOrder(null)}
                            />

                            {/* Modal Panel */}
                            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border-2 border-black shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col overflow-hidden">
                                {(() => {
                                    const order = orders.find((o: any) => o._id === expandedOrder);
                                    if (!order) return null;

                                    const statuses = [
                                        { key: 'PENDING', label: 'Placed', icon: Clock, desc: 'Awaiting dev' },
                                        { key: 'CONFIRMED', label: 'Confirmed', icon: ShieldCheck, desc: 'Verified' },
                                        { key: 'COURIERED', label: 'In Transit', icon: Truck, desc: 'On way' },
                                        { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Received' }
                                    ];

                                    const currentIdx = statuses.findIndex(s => s.key === order.status);
                                    const activeIdx = currentIdx === -1 ? 1 : currentIdx;

                                    return (
                                        <>
                                            <div className="flex flex-col bg-white overflow-hidden">
                                                {/* Header */}
                                                <div className="bg-black text-white p-3 md:p-4 flex justify-between items-center shrink-0">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 mb-0.5">Archive Entry</p>
                                                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic whitespace-nowrap">#{order._id.slice(-6).toUpperCase()}</h3>
                                                        </div>
                                                        <div className="h-6 w-px bg-white/20 hidden md:block" />
                                                        <div className="hidden md:block">
                                                            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Status</p>
                                                            <span className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-2 py-0.5 italic">
                                                                {order.status === 'COURIERED' ? 'IN TRANSIT' : order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setExpandedOrder(null)}
                                                        className="bg-white/10 hover:bg-white/20 p-2 transition-all hover:rotate-90"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Content - Scrollable */}
                                                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 custom-scrollbar">
                                                    {/* Tracking Timeline - Compact Horizontal */}
                                                    <div className="grid grid-cols-4 gap-2 relative">
                                                        <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-gray-100 z-0">
                                                            <div
                                                                className="h-full bg-black transition-all duration-1000"
                                                                style={{ width: `${(activeIdx / (statuses.length - 1)) * 100}%` }}
                                                            />
                                                        </div>
                                                        {statuses.map((step, idx) => {
                                                            const isCompleted = idx <= activeIdx;
                                                            const Icon = step.icon;
                                                            return (
                                                                <div key={idx} className="flex flex-col items-center text-center gap-2 relative z-10">
                                                                    <div className={`w-6 h-6 rounded-none flex items-center justify-center border transition-all duration-500 ${isCompleted ? 'bg-black border-black shadow-md scale-105' : 'bg-white border-gray-200'}`}>
                                                                        <Icon className={`w-2 h-2 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                                                                    </div>
                                                                    <div className="hidden md:block">
                                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>{step.label}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                        {/* Left Column: Items */}
                                                        <div className="space-y-6">
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3 flex justify-between items-center">
                                                                Product Summary
                                                                <span className="text-black italic">({order.items?.length} Items)</span>
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {order.items?.map((item: any, i: number) => (
                                                                    <div key={i} className="flex gap-4 items-center p-3 border border-gray-50 bg-gray-50/30 group hover:border-black transition-all">
                                                                        <div className="h-14 w-14 shrink-0 bg-white border border-gray-100 p-1 relative overflow-hidden">
                                                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-black text-[10px] uppercase tracking-tighter text-black truncate">{item.name}</p>
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                                                QTY {item.quantity} • ৳{item.price?.toFixed(0)}
                                                                                {(item.size || item.color) && ` • ${item.size || ''} ${item.color || ''}`.trim()}
                                                                            </p>
                                                                        </div>
                                                                        <p className="font-black text-[11px] text-black">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Right Column: Address & Financial */}
                                                        <div className="space-y-10">
                                                            <section className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Destination</h4>
                                                                <div className="bg-gray-50 p-6 space-y-2 border border-dashed border-gray-200">
                                                                    <p className="text-black font-black uppercase tracking-tight italic text-sm">{order.shippingAddress?.fullName}</p>
                                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest space-y-1">
                                                                        <p>{order.shippingAddress?.street}</p>
                                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                                        <p className="pt-3 text-black font-black border-t border-gray-200 mt-2">TEL: {order.shippingAddress?.phone}</p>
                                                                    </div>
                                                                </div>
                                                            </section>

                                                            <section className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Ledger Breakdown</h4>
                                                                <div className="space-y-3 text-[10px] font-black uppercase tracking-widest">
                                                                    <div className="flex justify-between text-gray-400">
                                                                        <span>Base Total</span>
                                                                        <span>৳{(order.itemsPrice || (order.totalAmount - (order.shippingPrice || 70))).toFixed(0)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-gray-400">
                                                                        <span>Courier Fee</span>
                                                                        <span>৳{(order.shippingPrice || 70).toFixed(0)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-xl text-black pt-4 border-t-2 border-black italic leading-none">
                                                                        <span>Grand Total</span>
                                                                        <span>৳{order.totalAmount?.toFixed(0)}</span>
                                                                    </div>
                                                                    <p className="text-[8px] font-bold text-gray-400 mt-4 text-center border border-gray-100 py-1 uppercase italic">Method: {order.paymentMethod || 'CASH ON DELIVERY'}</p>
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="py-3 px-4 md:px-5 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
                                                <Button
                                                    className="rounded-none bg-black text-white font-black uppercase tracking-widest text-[10px] h-10 px-12 hover:bg-gray-800 transition-all active:translate-y-0.5 shadow-sm"
                                                    onClick={() => setExpandedOrder(null)}
                                                >
                                                    Dismiss Entry
                                                </Button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

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
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<any>({
        name: '',
        phone: '',
        address: '',
        gender: '',
        birthDate: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                gender: profile.gender || 'male',
                birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : ''
            });
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: (data: any) => usersApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Your professional terminal has been updated', {
                description: 'Profile modifications saved successfully.'
            });
        },
        onError: (err: any) => {
            toast.error('Update operation failed', {
                description: err.response?.data?.message || 'Check your data integrity and try again.'
            });
        }
    });

    const handleUpdate = () => {
        mutation.mutate(formData);
    };

    const handleDiscard = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                gender: profile.gender || 'male',
                birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : ''
            });
            toast.info('Changes discarded', {
                description: 'Reverted to previous profile state.'
            });
        }
    };

    if (isLoading) return <div className="text-center py-12 font-black uppercase tracking-widest animate-pulse">Loading Profile...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Profile Information</h2>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-none border border-green-100">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Account</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Identity */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 pb-2 border-b border-gray-100">Basic Identity</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                <User2 className="w-3 h-3" /> Full Name
                            </Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-none border-gray-200 focus:border-black focus:ring-0 h-12 font-medium bg-white"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Primary Email
                            </Label>
                            <Input
                                defaultValue={profile?.email}
                                disabled
                                className="rounded-none border-gray-100 bg-gray-50 text-gray-400 h-12 font-medium cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Default Address
                            </Label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full rounded-none border-gray-200 focus:border-black focus:ring-0 p-3 text-sm font-medium bg-white min-h-[100px] resize-none border"
                                placeholder="Enter your full shipping address"
                            />
                        </div>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 pb-2 border-b border-gray-100">Personal Details</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Phone Number
                            </Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="rounded-none border-gray-200 focus:border-black focus:ring-0 h-12 font-medium bg-white"
                                placeholder="+880 1XXX XXXXXX"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(val) => setFormData({ ...formData, gender: val })}
                                >
                                    <SelectTrigger className="rounded-none border-gray-200 focus:ring-0 h-12 font-medium bg-white">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-black">
                                        <SelectItem value="male" className="rounded-none">Male</SelectItem>
                                        <SelectItem value="female" className="rounded-none">Female</SelectItem>
                                        <SelectItem value="other" className="rounded-none">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Birth Date
                                </Label>
                                <Input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="rounded-none border-gray-200 focus:border-black focus:ring-0 h-12 font-medium bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={handleUpdate}
                    disabled={mutation.isPending}
                    className="bg-black text-white rounded-none font-black uppercase tracking-widest text-[11px] h-14 px-12 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                >
                    {mutation.isPending ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating Profile</span>
                        </div>
                    ) : (
                        "Update Profile Settings"
                    )}
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleDiscard}
                    disabled={mutation.isPending}
                    className="rounded-none border-gray-200 font-black uppercase tracking-widest text-[11px] h-14 px-8 text-gray-400"
                >
                    Discard Changes
                </Button>
            </div>
        </div>
    );
}

function SecurityView() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => usersApi.updateProfile(data),
        onSuccess: () => {
            toast.success('Password updated successfully', {
                description: 'Your security protocols have been refreshed.',
                icon: <ShieldCheck className="w-4 h-4 text-green-500" />
            });
            setIsEditing(false);
            setFormData({ currentPassword: '', password: '', confirmPassword: '' });
            setShowPasswords({ current: false, new: false, confirm: false });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error: any) => {
            toast.error('Update Failed', {
                description: error.response?.data?.message || 'Could not update password.'
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.currentPassword) {
            return toast.error('Verification Required', { description: 'Please enter your current password.' });
        }
        if (formData.password.length < 6) {
            return toast.error('Too Short', { description: 'New password must be at least 6 characters.' });
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Mismatch Detected', { description: 'New passwords do not match.' });
        }
        mutation.mutate({ currentPassword: formData.currentPassword, password: formData.password });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Security & Privacy</h2>
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide mt-1">Manage your account access and verification methods.</p>
            </div>

            <Card className="rounded-none border-gray-100 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 space-y-8">
                        <section className="space-y-6">
                            <div className="flex items-start justify-between gap-8">
                                <div className="flex-1">
                                    <h3 className="font-black uppercase tracking-tight text-lg leading-tight">Password Management</h3>
                                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mt-1">Recommended to change your password every 90 days for optimal safety.</p>

                                    {isEditing && (
                                        <form onSubmit={handleSubmit} className="mt-8 space-y-6 w-full animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-black">Current Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswords.current ? 'text' : 'password'}
                                                        required
                                                        value={formData.currentPassword}
                                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                        className="rounded-none border-gray-200 focus:border-black h-12 text-sm pr-12"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="h-px bg-gray-100" />
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-black">New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        required
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="rounded-none border-gray-200 focus:border-black h-12 text-sm pr-12"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-black">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        required
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        className="rounded-none border-gray-200 focus:border-black h-12 text-sm pr-12"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    type="submit"
                                                    disabled={mutation.isPending}
                                                    className="rounded-none bg-black text-white font-black uppercase tracking-widest text-[10px] h-11 px-8 flex-1 hover:bg-gray-800 transition-colors"
                                                >
                                                    {mutation.isPending ? "Validating..." : "Save New Password"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setIsEditing(false)}
                                                    className="rounded-none border border-gray-200 font-black uppercase tracking-widest text-[10px] h-11 px-6 text-gray-400 flex-1 hover:bg-gray-100 hover:text-black transition-colors"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                                {!isEditing && (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="outline"
                                        className="rounded-none border-black border-2 font-black uppercase tracking-widest text-[10px] h-11 px-8 hover:bg-black hover:text-white transition-all shrink-0"
                                    >
                                        Change Password
                                    </Button>
                                )}
                            </div>
                        </section>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gray-50 p-6 border border-gray-100 italic text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                By managing these settings, you ensure the integrity of your personal information and transaction history within the Fire Cutter portal.
            </div>
        </div>
    );
}
