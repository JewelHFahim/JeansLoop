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
    <section className="relative h-[700px] w-full bg-black text-white overflow-hidden group">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide: any, index: number) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full flex items-center min-w-0">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title?.replace('\\n', ' ')}
                  className={`h-full w-full object-cover transition-all duration-[6000ms] ease-out ${selectedIndex === index ? 'scale-105 opacity-60' : 'scale-100 opacity-0'}`}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Content */}
              <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-3xl">
                  <h1
                    className={`mb-6 text-6xl font-black uppercase tracking-tighter leading-[0.9] md:text-8xl italic whitespace-pre-line
                      transition-all duration-1000 delay-300
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
                    className={`mb-10 text-xl text-gray-200 font-medium max-w-xl
                      transition-all duration-1000 delay-500
                      ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    `}
                  >
                    {slide.subtitle}
                  </p>
                  <div
                    className={`flex flex-wrap gap-4
                      transition-all duration-1000 delay-700
                      ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    `}
                  >
                    {slide.primaryCta && slide.primaryCta.text && slide.primaryCta.href && (
                      <Link href={slide.primaryCta.href}>
                        <Button className="h-16 bg-white px-10 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 rounded-none transform transition hover:scale-105">
                          {slide.primaryCta.text}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                    {slide.secondaryCta && slide.secondaryCta.text && slide.secondaryCta.href && (
                      <Link href={slide.secondaryCta.href}>
                        <Button variant="outline" className="h-16 border-white bg-transparent px-10 text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black rounded-none transition">
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

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-500 rounded-full ${index === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
