'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
    variant?: 'page' | 'inline' | 'full';
    text?: string;
    className?: string;
}

export const Loader = ({ variant = 'inline', text, className }: LoaderProps) => {
    if (variant === 'page' || variant === 'full') {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000",
                variant === 'full' ? "fixed inset-0 bg-white z-50" : "py-40 w-full",
                className
            )}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-2 border-black animate-rotate-diamond" />
                    <div className="absolute inset-2 border border-black/20 animate-[rotate-diamond_4s_linear_infinite_reverse]" />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black animate-elegant-pulse">
                        {text || 'Initializing Premium Experience'}
                    </p>
                    <div className="h-px w-32 bg-gray-100 relative overflow-hidden">
                        <div className="absolute h-full bg-black w-1/4 animate-[shimmer_2s_infinite_linear]" />
                    </div>
                </div>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { left: -100%; }
                        100% { left: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="w-4 h-4 border border-black animate-rotate-diamond shrink-0" />
            <p className="text-[9px] font-black uppercase tracking-widest text-black animate-elegant-pulse italic">
                {text || 'Processing'}
            </p>
        </div>
    );
};
