'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black text-gray-300">
            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand & About */}
                    <div>
                        <h3 className="mb-4 text-2xl font-bold text-white">MenStyle</h3>
                        <p className="mb-4 text-sm leading-relaxed">
                            Premium menswear designed for the modern gentleman. Quality, comfort, and style in every stitch.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white"><Twitter className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/shop" className="hover:text-white">Shop All</Link></li>
                            <li><Link href="/shop?category=Jeans" className="hover:text-white">Jeans</Link></li>
                            <li><Link href="/shop?category=Shirts" className="hover:text-white">Shirts</Link></li>
                            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-white">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                            <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-white">Returns & Exchanges</Link></li>
                            <li><Link href="/size-guide" className="hover:text-white">Size Guide</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-white">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                                <span>123 Fashion Street, Design District, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0" />
                                <span>support@menstyle.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} MenStyle. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
