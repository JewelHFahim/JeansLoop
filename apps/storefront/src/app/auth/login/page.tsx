'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await authApi.login(formData.email, formData.password);

            // Backend returns: { _id, name, email, role, token }
            if (data.token) {
                const userData = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                };
                login(data.token, userData);
                router.push('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen py-12 lg:py-24 flex items-center">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="border-2 border-black p-8 md:p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                    <div className="border-b-2 border-black pb-8 mb-10 text-center">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-black mb-4">
                            Welcome Back
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Enter your credentials / Identity Verified
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 text-[11px] font-black uppercase tracking-widest text-red-500 animate-pulse">
                                Error: {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Email Address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-14 rounded-none border-gray-200 border-2 focus:border-black transition-all font-bold placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Password</label>
                                    <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Forgot?</Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-14 rounded-none border-gray-200 border-2 focus:border-black transition-all font-bold placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl group"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Secure Sign In'}
                            <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                        </Button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            New to Fire Cutter?{' '}
                            <Link href="/auth/register" className="text-black hover:underline underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
