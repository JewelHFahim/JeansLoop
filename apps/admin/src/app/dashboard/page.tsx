'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statsApi } from '@/lib/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, TrendingUp, Clock, Star } from 'lucide-react';

const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'];

export default function DashboardPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await statsApi.getDashboard();
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Revenue',
            value: `৳${stats?.totalSales?.toLocaleString() || 0}`,
            icon: DollarSign,
            trend: '+12.5%',
            description: 'Total delivered sales'
        },
        {
            title: 'Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            trend: '+5.2%',
            description: 'Lifetime orders'
        },
        {
            title: 'Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            trend: 'Active',
            description: 'In inventory'
        },
        {
            title: 'Customers',
            value: stats?.totalUsers || 0,
            icon: Users,
            trend: '+2',
            description: 'Registered users'
        },
    ];

    const salesData = stats?.salesHistory?.map((item: any) => ({
        name: new Date(item._id).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        sales: item.totalSales,
        orders: item.orderCount
    })) || [];

    const statusData = stats?.orderStatusDistribution?.map((item: any) => ({
        name: item._id,
        value: item.count
    })) || [];

    return (
        <div className="space-y-10 pb-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-8">
                <div className="space-y-4">
                    <h1 className="text-xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Command Center</h1>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Real-time Metrics & Insights
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2 italic shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] w-fit">
                    <TrendingUp className="h-3 w-3" /> System Status: Optimal
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default group overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1">
                                    {stat.trend} <ArrowUpRight className="h-3 w-3" />
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.title}</p>
                                <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">{stat.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="rounded-none border-4 border-black lg:col-span-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                    <CardHeader className="border-b-2 border-gray-50 bg-gray-50/50">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Sales Performance (30 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '0px',
                                        border: '3px solid black',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#000000"
                                    strokeWidth={4}
                                    dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                    <CardHeader className="border-b-2 border-gray-50 bg-gray-50/50">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <Star className="h-4 w-4" /> Order Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '0px',
                                        border: '3px solid black',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Orders */}
                <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                    <CardHeader className="border-b-2 border-gray-50 bg-gray-50/50">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em]">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full" style={{ minWidth: '400px' }}>
                                <thead>
                                    <tr className="border-b-2 border-black bg-black text-white">
                                        <th className="px-3 md:px-6 py-3 text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest">ID</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest">Customer</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest">Amount</th>
                                        <th className="px-3 md:px-6 py-3 text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentOrders?.map((order: any) => (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-3 md:px-6 py-3 text-[9px] font-bold text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-3 md:px-6 py-3 max-w-[120px]">
                                                <div className="text-[9px] font-black uppercase truncate">{order.userId?.name || 'Guest'}</div>
                                                <div className="text-[8px] font-bold text-gray-400 truncate">{order.userId?.email}</div>
                                            </td>
                                            <td className="px-3 md:px-6 py-3 text-[10px] font-black whitespace-nowrap">৳{order.totalAmount}</td>
                                            <td className="px-3 md:px-6 py-3">
                                                <span className={`text-[8px] font-black border-2 px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap ${order.status === 'DELIVERED' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                    <CardHeader className="border-b-2 border-gray-50 bg-gray-50/50">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em]">Best Sellers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                        {stats?.topProducts?.map((item: any, idx: number) => (
                            <div key={item._id} className="flex items-center justify-between gap-3 group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white flex items-center justify-center font-black italic text-lg md:text-xl shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[10px] md:text-xs font-black uppercase italic tracking-tighter group-hover:text-gray-600 transition-colors truncate">{item.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{item.quantity} Units Sold</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] md:text-xs font-black italic tracking-tighter whitespace-nowrap">৳{item.revenue.toLocaleString()}</p>
                                    <div className="mt-1 h-1 w-16 md:w-24 bg-gray-100">
                                        <div
                                            className="h-full bg-black"
                                            style={{ width: `${(item.quantity / (stats.topProducts[0].quantity || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
