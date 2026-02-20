import { Truck, Globe, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                        <Truck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                        Logistics / <span className="text-gray-400">Protocol</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        Shipping & Delivery Information
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <Clock className="w-6 h-6 mb-4 text-emerald-600" />
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Processing</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Orders are prioritized and dispatched within 24-48 business hours.</p>
                    </div>
                    <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <ShieldCheck className="w-6 h-6 mb-4 text-blue-600" />
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Secure Path</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Real-time tracking and signature delivery for all premium assets.</p>
                    </div>
                    <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <Globe className="w-6 h-6 mb-4 text-rose-600" />
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Global Ops</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Worldwide logistics covering over 50 primary economic sectors.</p>
                    </div>
                </div>

                <div className="border-4 border-black bg-white overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-black text-white p-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] italic">Operational Timelines</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-4 border-black text-[10px] font-black uppercase tracking-widest bg-gray-50">
                                    <th className="p-6">Region / Sector</th>
                                    <th className="p-6">Method</th>
                                    <th className="p-6">ETA</th>
                                    <th className="p-6 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-bold uppercase tracking-tight">
                                <tr className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-6 italic">Domestic / Express</td>
                                    <td className="p-6 text-emerald-600">Flash Priority</td>
                                    <td className="p-6">24 - 48 Hours</td>
                                    <td className="p-6 text-right">TK 150</td>
                                </tr>
                                <tr className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-6 italic">Domestic / Standard</td>
                                    <td className="p-6">Secure Ground</td>
                                    <td className="p-6">3 - 5 Days</td>
                                    <td className="p-6 text-right">TK 80</td>
                                </tr>
                                <tr className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-6 italic">International / Tier 1</td>
                                    <td className="p-6 text-blue-600">Global Air</td>
                                    <td className="p-6">7 - 10 Days</td>
                                    <td className="p-6 text-right">$25.00</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 italic">International / Tier 2</td>
                                    <td className="p-6">Standard Sea</td>
                                    <td className="p-6">14 - 21 Days</td>
                                    <td className="p-6 text-right">$15.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 p-8 border-4 border-black bg-gray-50">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                        Customs & Duties
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        International shipments may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. MenStyle is not responsible for these charges if they are applied and are your responsibility as the customer.
                    </p>
                </div>
            </div>
        </div>
    );
}
