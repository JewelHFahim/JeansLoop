'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productsApi } from '@/lib/api';
import { ArrowRight } from 'lucide-react';
import { CategoryPromoSection } from '@/components/home/CategoryPromoSection';
import { SocksPromotionSection } from '@/components/home/SocksPromotionSection';

export default function HomePage() {
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await productsApi.getAll({ limit: 100 });
      return response.data;
    },
  });

  const products = productsData?.products || [];

  // Filter products by category
  const jeansProducts = products.filter((p: any) => p.category?.toUpperCase() === 'JEANS');
  const twillProducts = products.filter((p: any) => p.category?.toUpperCase() === 'TWILL');
  const trouserProducts = products.filter((p: any) => p.category?.toUpperCase() === 'TROUSER');
  const socksProducts = products.filter((p: any) => p.category?.toUpperCase() === 'SOCKS' || p.category?.toUpperCase() === 'ACCESSORIES');

  return (
    <div className="pb-16 bg-white">
      {/* Hero Section */}
      <section className="relative h-[700px] w-full bg-black text-white flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Banner"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-6xl font-black uppercase tracking-tighter leading-[0.9] md:text-8xl italic">
              Elevate Your <br /> Everyday
            </h1>
            <p className="mb-10 text-xl text-gray-300 font-medium max-w-xl">
              Premium menswear designed for the modern gentleman.
              Discover quality craftsmanship and contemporary style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button className="h-16 bg-white px-10 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-200 rounded-none transform transition hover:scale-105">
                  Shop All Models
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop?category=JEANS">
                <Button variant="outline" className="h-16 border-white bg-transparent px-10 text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black rounded-none transition">
                  Browse Denim
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-0">
        {/* Jeans Section */}
        <div className="bg-white py-12">
          <SocksPromotionSection
            category="JEANS"
            title="PREMIUM"
            subtitle="DENIM SERIES"
            description="Our signature denim collection. Engineered for comfort and longevity using the finest indigo-dyed fabrics."
            bannerImage="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop"
            products={jeansProducts}
          />
        </div>

        {/* Twill Section */}
        <div className="bg-gray-50 py-12">
          <SocksPromotionSection
            category="TWILL"
            title="CLASSIC"
            subtitle="TWILL COLLECTION"
            description="Versatile and refined cotton twill. The essential choice for a sophisticated casual look that stays crisp all day."
            bannerImage="https://images.unsplash.com/photo-1473966968600-fa804b86862b?q=80&w=1000&auto=format&fit=crop"
            products={twillProducts}
          />
        </div>

        {/* Trouser Section */}
        <div className="bg-white py-12">
          <SocksPromotionSection
            category="TROUSER"
            title="TAILORED"
            subtitle="TROUSER LINE"
            description="Sharp silhouettes and precision tailoring. Designed for professionals who demand excellence in every detail."
            bannerImage="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop"
            products={trouserProducts}
          />
        </div>

        {/* Socks Section - Dynamic & High Contrast */}
        <div className="bg-gray-50 py-12">
          <SocksPromotionSection
            category="SOCKS"
            title="SOCKS"
            subtitle="ANTI-BACTERIAL SERIES"
            description="Engineered for elite performance. Crafted from sustainable cotton for durability and medical-grade protection."
            bannerImage="https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=800&auto=format&fit=crop"
            products={socksProducts}
          />
        </div>
      </div>
    </div>
  );
}
