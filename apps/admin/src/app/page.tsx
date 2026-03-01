'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      const { token, role } = response.data;

      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white border-8 border-black p-4">
      <div className="w-full max-w-md">
        <div className="border-4 border-black p-8 md:p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-black translate-x-8 -translate-y-8 rotate-45" />

          <div className="border-b-4 border-black pb-8 mb-10">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-black mb-4">
              Admin / <br />
              <span className="text-2xl not-italic">Terminal</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Authorization Required / Identity Protocol
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border-l-4 border-red-600 bg-red-50 p-4 text-[11px] font-black uppercase tracking-widest text-red-600 animate-pulse">
                Access Denied: {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-black flex justify-between">
                <span>Email Identifier</span>
                <span className="text-gray-300">REQ*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ADMIN@FIRECUTTER.COM"
                className="rounded-none border-2 border-black h-12 text-xs font-bold focus-visible:ring-0 focus-visible:border-black uppercase bg-white placeholder:text-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-black flex justify-between">
                <span>Access Credential</span>
                <span className="text-gray-300">SECURE</span>
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-none border-2 border-black h-12 text-xs font-bold focus-visible:ring-0 focus-visible:border-black bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-black text-white rounded-none font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Establish Connection / Login'}
            </Button>

            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                Mainframe v2.0 / All operations logged
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
