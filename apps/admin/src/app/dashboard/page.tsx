'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statsApi } from '@/lib/api';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function DashboardPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await statsApi.getDashboard();
            return response.data;
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'text-blue-600',
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'text-green-600',
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-purple-600',
        },
        {
            title: 'Total Sales',
            value: `$${stats?.totalSales?.toFixed(2) || 0}`,
            icon: DollarSign,
            color: 'text-yellow-600',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="border-b-4 border-black pb-4">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Console / Dashboard</h1>
                <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mt-2">System Overview / Active Metrics</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="rounded-none border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default group">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b-2 border-gray-50 bg-gray-50/30">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-black">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-black group-hover:scale-125 transition-transform" />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-4xl font-black leading-none tracking-tighter italic">{stat.value}</div>
                                <div className="mt-4 h-1 w-full bg-gray-100 overflow-hidden">
                                    <div className="h-full bg-black w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Placeholder for future activity charts */}
            <div className="border-4 border-black p-12 flex flex-col items-center justify-center bg-gray-50 text-center animate-pulse">
                <Package className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">Activity Analytics Initializing</h3>
            </div>
        </div>
    );
}
