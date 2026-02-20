'use client';

import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                        Contact / <span className="text-gray-400">Protocol</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        Establish Communication / Command Center
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tight">Access Points</h2>
                            <div className="grid gap-6">
                                <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">HQ Coordinates</h3>
                                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                                123 Fashion Street, Design District<br />New York, NY 10001
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Direct Line</h3>
                                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                                Voice: +1 (555) 123-4567<br />Mon - Fri / 09:00 - 18:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Digital Signal</h3>
                                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                                support@jeansloop.com<br />24/7 Response Objective
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tight">Signal / Transmission</h2>

                        {status === 'sent' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-500 text-white flex items-center justify-center rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.2)]">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic mb-2">Transmission Successful</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Our personnel will initiate contact shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-[10px] font-black uppercase underline tracking-widest hover:text-gray-500 transition-colors"
                                >
                                    Resend Transmission
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Personnel Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="FULL IDENTITY"
                                            className="w-full bg-gray-50 border-2 border-black rounded-none p-4 text-[10px] font-black uppercase outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Return Channel</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="EMAIL ADDRESS"
                                            className="w-full bg-gray-50 border-2 border-black rounded-none p-4 text-[10px] font-black uppercase outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Subject</label>
                                    <select className="w-full bg-gray-50 border-2 border-black rounded-none p-4 text-[10px] font-black uppercase outline-none focus:bg-white transition-all appearance-none cursor-pointer">
                                        <option>General Support Inquiry</option>
                                        <option>Order Discrepancy</option>
                                        <option>Asset Liquidation / Returns</option>
                                        <option>Business Collaboration</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transmission Payload</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="PROVIDE DETAILED INTEL..."
                                        className="w-full bg-gray-50 border-2 border-black rounded-none p-4 text-[10px] font-black uppercase outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    disabled={status === 'sending'}
                                    className="w-full bg-black text-white p-5 text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {status === 'sending' ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Execute Transmission
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
