'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { slidersApi } from '@/lib/api';

const defaultSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    title: 'Elevate Your \n Everyday',
    subtitle: 'Premium menswear designed for the modern gentleman. Discover quality craftsmanship and contemporary style.',
    primaryCta: { text: 'Shop All Models', href: '/shop' },
    secondaryCta: { text: 'Browse Denim', href: '/shop?category=JEANS' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop',
    title: 'Precision \n Tailoring',
    subtitle: 'Sharp silhouettes and precision tailoring. Designed for professionals who demand excellence in every detail.',
    primaryCta: { text: 'Explore Tailored', href: '/shop?category=TROUSER' },
    secondaryCta: { text: 'View Collection', href: '/shop' },
  },
  {
    id: 3,
    image: '/sliders/slider1.jpg',
    title: 'Classic \n Denim',
    subtitle: 'Versatile and refined cotton denim. The essential choice for a sophisticated casual look that stays crisp all day.',
    primaryCta: { text: 'Shop Denim', href: '/shop?category=DENIM' },
    secondaryCta: null,
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: slidersResponse } = useQuery({
    queryKey: ['active-sliders'],
    queryFn: async () => {
      const res = await slidersApi.getActive();
      return res.data;
    },
  });

  const dbSlides = slidersResponse?.data || [];
  const slides = dbSlides.length > 0 ? dbSlides : defaultSlides;

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full bg-white">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
      <div className="relative h-[480px] md:h-[550px] lg:h-[600px] w-full bg-black text-white overflow-hidden group">
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {slides.map((slide: any, index: number) => (
              <div key={slide.id} className="relative flex-[0_0_100%] h-full flex items-center min-w-0">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title?.replace('\\n', ' ')}
                    className={`h-full w-full object-cover transition-transform duration-10000 ease-out origin-center ${selectedIndex === index ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`}
                  />
                  {/* Creative Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-black/30 md:bg-transparent" />
                </div>

                {/* Content */}
                <div className="container relative z-10 mx-auto px-4">
                  <div className="max-w-2xl text-left">
                    <div
                      className={`inline-flex items-center gap-2 mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] md:text-xs font-bold tracking-[0.2em] text-white uppercase
                        transition-all duration-1000 delay-200
                        ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                      `}
                    >
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
                      Featured Collection
                    </div>
                    
                    <h1
                      className={`mb-3 md:mb-6 text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic whitespace-pre-line
                        transition-all duration-1000 delay-400
                        ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                      `}
                    >
                      {slide.title?.split('\\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}
                          {i !== slide.title.split('\\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h1>
                    <p
                      className={`mb-8 md:mb-10 text-sm md:text-xl text-gray-200 font-medium max-w-[90%] md:max-w-xl
                        transition-all duration-1000 delay-600
                        ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                      `}
                    >
                      {slide.subtitle}
                    </p>
                    <div
                      className={`flex flex-col md:flex-row flex-wrap gap-2.5 md:gap-4 w-full md:w-auto pr-8 md:pr-0
                        transition-all duration-1000 delay-800
                        ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                      `}
                    >
                      {slide.primaryCta && slide.primaryCta.text && slide.primaryCta.href && (
                        <Link href={slide.primaryCta.href} className="w-full md:w-auto">
                          <Button className="w-full md:w-auto h-[44px] md:h-14 bg-white px-6 md:px-10 text-[11px] md:text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 rounded-full transform transition hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] md:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            {slide.primaryCta.text}
                            <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-5 md:w-5" />
                          </Button>
                        </Link>
                      )}
                      {slide.secondaryCta && slide.secondaryCta.text && slide.secondaryCta.href && (
                        <Link href={slide.secondaryCta.href} className="w-full md:w-auto">
                          <Button variant="outline" className="w-full md:w-auto h-[44px] md:h-14 border-white/40 md:border-white/50 bg-black/20 backdrop-blur-sm px-6 md:px-10 text-[11px] md:text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black rounded-full transition">
                            {slide.secondaryCta.text}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Pagination styling with Progress Indicator */}
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              className={`relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${index === selectedIndex ? 'w-16 bg-white/30' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === selectedIndex && (
                <div 
                  className="absolute top-0 left-0 h-full bg-white" 
                  style={{ animation: 'slideProgress 6s linear forwards' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
