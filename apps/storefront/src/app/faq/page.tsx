'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How do I determine the right size for me?",
        answer: "Every product page includes a detailed size guide. We recommend measuring a similar garment you already own and comparing it with our measurements. If you're between sizes, we usually recommend sizing up for a more comfortable fit."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders. You'll receive a tracking number as soon as your order is dispatched."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for most items in their original, unworn condition with tags attached. Please visit our Returns & Exchanges page for full details and to start the process."
    },
    {
        question: "Is international shipping available?",
        answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location and will be calculated at checkout."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive an email with a tracking link. You can also track your order directly in your account dashboard under 'Order History'."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and regional payment methods like bKash. All transactions are securely processed and encrypted."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-none mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                        General / <span className="text-gray-400">Inquiry</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                        Frequently Asked Questions / Support
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border-4 border-black transition-all ${openIndex === index ? 'bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 hover:bg-white'}`}
                        >
                            <button
                                className="w-full text-left p-6 flex items-center justify-between group"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-xs font-black uppercase tracking-widest leading-relaxed pr-8">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 shrink-0 group-hover:translate-y-0.5 transition-transform" />
                                )}
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="h-0.5 bg-black/10 mb-6" />
                                    <div className="text-sm text-gray-600 leading-relaxed font-medium">
                                        {faq.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 border-4 border-black bg-black text-white text-center">
                    <h3 className="text-xl font-black uppercase italic italic mb-2 tracking-tight">Still have questions?</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Our support personnel are standing by 24/7</p>
                    <a
                        href="/contact"
                        className="inline-block border-2 border-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                    >
                        Contact Command Center
                    </a>
                </div>
            </div>
        </div>
    );
}
