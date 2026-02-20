import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                        Privacy / <span className="text-gray-400">Protocol</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        Data Protection & System Security
                    </p>
                </div>

                <div className="bg-white border-4 border-black p-10 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tight flex items-center gap-3">
                                <FileText className="w-5 h-5" /> 1.0 Data Collection
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                We gather identity information when you perform transactions, register for access, or interact with our system protocols. This includes names, delivery coordinates, digital contact points, and transaction history.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tight flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5" /> 2.0 Identity Protection
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Your digital identity is protected by industry-standard encryption protocols. We do not expose your personnel data to external third parties except for essential logistics and liquidation partners.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tight flex items-center gap-3">
                                <Lock className="w-5 h-5" /> 3.0 Secure Liquidation
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Financial transactions are executed via decentralized, PCI-compliant gateways. MenStyle does not archive complete credit asset identifiers on our local servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black uppercase italic mb-6 tracking-tight flex items-center gap-3">
                                <EyeOff className="w-5 h-5" /> 4.0 Your Authority
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                You hold total authority over your data. You may request the export, modification, or termination of your digital identity within our system at any time by contacting the command center.
                            </p>
                        </section>
                    </div>

                    <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-200 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            System Version 2.0.4 / Last Updated: Feb 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
