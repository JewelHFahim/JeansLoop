import { RefreshCcw, Package, CreditCard, ShieldAlert } from 'lucide-react';

export default function ReturnsPage() {
    const steps = [
        {
            icon: Package,
            title: "Initiate Request",
            desc: "Access your 'Order Details' via the dashboard and select 'Request Exchange/Return'."
        },
        {
            icon: ShieldAlert,
            title: "Quality Check",
            desc: "Ensure assets are in original condition with all security tags and packaging intact."
        },
        {
            icon: RefreshCcw,
            title: "Safe Return",
            desc: "Ship the item back using our pre-paid label or your preferred secure carrier."
        },
        {
            icon: CreditCard,
            title: "Liquidation",
            desc: "Once verified, your refund will be processed to the original payment channel within 7 days."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                        <RefreshCcw className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                        Returns / <span className="text-gray-400">Exchange</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        Asset Liquidation & Swap Protocol
                    </p>
                </div>

                <div className="mb-20">
                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -top-4 -left-4 text-6xl font-black text-gray-100 italic group-hover:text-gray-200 transition-colors">0{i + 1}</div>
                                <div className="relative pt-4">
                                    <step.icon className="w-6 h-6 mb-4 text-black" />
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 italic">Step / {i + 1}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-10 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase italic italic mb-6 tracking-tight">Eligibility Criteria</h2>
                        <ul className="space-y-4">
                            {[
                                "Assets must be in original unworn condition",
                                "All security tags must remain attached",
                                "Original packaging must be included",
                                "Action must be initiated within 30 days"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-black">
                                    <div className="w-4 h-4 border-2 border-black flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-black"></div>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-10 border-4 border-black bg-black text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
                        <h2 className="text-xl font-black uppercase italic italic mb-6 tracking-tight text-white">Refund Protocol</h2>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                            Refunds are issued to the original payment channel. For COD orders, store credit or bank transfer options are available. Processing time is usually 5-7 business days post-verification.
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Assets</span>
                                <span className="text-[11px] font-black">5 - 10 Days</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital / bKash</span>
                                <span className="text-[11px] font-black">2 - 3 Days</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Credit</span>
                                <span className="text-[11px] font-black text-emerald-400 italic">Instant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
