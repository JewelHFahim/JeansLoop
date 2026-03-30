'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
    variant?: 'page' | 'inline' | 'button';
    text?: string;
    className?: string;
}

export const Loader = ({ variant = 'inline', text, className }: LoaderProps) => {
    if (variant === 'page') {
        return (
            <div className={cn("min-h-[400px] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500", className)}>
                <div className="relative w-20 h-20 border-4 border-black flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 animate-scanline h-1/2 w-full" />
                    <div className="text-4xl font-black italic tracking-tighter animate-glitch text-black select-none">
                        X
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black animate-tech-pulse shrink-0">
                        {text || 'DECRYPTING_DATA_STREAM'}
                    </p>
                    <div className="h-[2px] w-48 bg-gray-100 relative overflow-hidden">
                        <div className="absolute h-full bg-black w-1/3 animate-[loading-bar_1.5s_infinite_ease-in-out]" />
                    </div>
                </div>
                <style jsx>{`
                    @keyframes loading-bar {
                        0% { left: -40%; width: 30%; }
                        50% { width: 50%; }
                        100% { left: 110%; width: 20%; }
                    }
                `}</style>
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full" />
                <span className="text-inherit">{text}</span>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3 py-2", className)}>
            <div className="w-5 h-5 border-2 border-black flex items-center justify-center animate-spin relative overflow-hidden shrink-0">
                <div className="w-full h-px bg-black absolute rotate-45" />
                <div className="w-full h-px bg-black absolute -rotate-45" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-black animate-tech-pulse italic truncate">
                {text || 'PROCESSING_ASSET'}
            </p>
        </div>
    );
};
