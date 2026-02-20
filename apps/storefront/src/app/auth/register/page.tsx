'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await authApi.register(formData.name, formData.email, formData.password);
            // On success, redirect to login
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
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
                            Create Account
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Join the collection / Premium Access
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
                                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Full Name</label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-14 rounded-none border-gray-200 border-2 focus:border-black transition-all font-bold placeholder:text-gray-300"
                                />
                            </div>

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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Password</label>
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
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Confirm</label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="h-14 rounded-none border-gray-200 border-2 focus:border-black transition-all font-bold placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl group"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Register Now'}
                            <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                        </Button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Already a member?{' '}
                            <Link href="/auth/login" className="text-black hover:underline underline-offset-4">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
