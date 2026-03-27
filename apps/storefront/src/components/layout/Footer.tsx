'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Youtube, MessageCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';

export function Footer() {
    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await settingsApi.get();
            return response.data;
        },
    });

    const siteTitle = settings?.title || 'JeansLoop';

    return (
        <footer className="bg-black text-gray-300">
            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand & About */}
                    <div>
                        <div className="flex flex-col items-start gap-1 mb-6">
                            {settings?.logo ? (
                                <img src={settings.logo} alt={siteTitle} className="h-8 w-auto brightness-0 invert" />
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{siteTitle}</h3>
                                    <p className="text-[13px] font-normal italic leading-relaxed text-gray-400">
                                        {settings?.tagline || 'Premium menswear designed for the modern gentleman.'}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="flex gap-4">
                            {settings?.socialLinks?.facebook && (
                                <Link href={settings.socialLinks.facebook} target="_blank" className="hover:text-white transition-colors"><Facebook className="h-4 w-4" /></Link>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <Link href={settings.socialLinks.instagram} target="_blank" className="hover:text-white transition-colors"><Instagram className="h-4 w-4" /></Link>
                            )}
                            {settings?.socialLinks?.youtube && (
                                <Link href={settings.socialLinks.youtube} target="_blank" className="hover:text-white transition-colors"><Youtube className="h-4 w-4" /></Link>
                            )}
                            {settings?.socialLinks?.whatsapp && (
                                <Link href={`https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" className="hover:text-white transition-colors"><MessageCircle className="h-4 w-4" /></Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white">Registry</h4>
                        <ul className="space-y-3 text-[12px] font-bold uppercase tracking-widest text-gray-400">
                            <li><Link href="/shop" className="hover:text-white transition-colors">Digital Shop</Link></li>
                            <li><Link href="/shop?category=jeans" className="hover:text-white transition-colors">Denim Assets</Link></li>
                            <li><Link href="/shop?category=shirts" className="hover:text-white transition-colors">Apparel</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Terminal</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white">Protocols</h4>
                        <ul className="space-y-3 text-[12px] font-bold uppercase tracking-widest text-gray-400">
                            <li><Link href="/faq" className="hover:text-white transition-colors">Direct Support</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Logistics Info</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Reverse Logistics</Link></li>
                            <li><Link href="/size-guide" className="hover:text-white transition-colors">Dimension Guide</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Data Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-white">Contact Interface</h4>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-400">
                            {settings?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-white" />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                            {settings?.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-white" />
                                    <span>{settings.phone}</span>
                                </li>
                            )}
                            {settings?.email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-white" />
                                    <span className="break-all">{settings.email}</span>
                                </li>
                            )}
                            {settings?.businessHours && (
                                <li className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 shrink-0 text-white" />
                                    <span>{settings.businessHours}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {siteTitle} Hub. Digital Architecture by JeansLoop.</p>
                    <div className="flex gap-6">
                        <span>All Rights Reserved</span>
                        <span>Global Dispatch</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
