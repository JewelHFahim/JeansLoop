'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { productsApi, categoriesApi } from '@/lib/api';
import { SocksPromotionSection } from '@/components/home/SocksPromotionSection';

import { HeroSlider } from '@/components/home/HeroSlider';

export default function HomePage() {
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await productsApi.getAll({ limit: 100 });
      return response.data;
    },
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response.data;
    },
  });

  const products = productsData?.products || [];
  const categories = categoriesResponse || [];

  return (
    <div className="pb-16 bg-white">
      {/* Hero Section */}
      <HeroSlider />

      {/* Stylish Category Section (Desktop Only, Overlapping Slider) */}
      {categories.length > 0 && (
        <div className="hidden md:block container mx-auto px-4 relative z-30 -mt-8 mb-10">
          <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl py-4 px-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
            <div className="flex justify-between items-center gap-2">
              {categories.slice(0, 6).map((c: any) => {
                const fallbackImage = "/images/banners/Category_Banner_1.avif";
                return (
                  <Link key={c._id || c.name} href={`/shop?category=${c.slug || c.name}`} className="group flex flex-col items-center gap-2">
                    <div className="w-[64px] h-[64px] rounded-full p-[3px] bg-white shadow-sm border border-gray-100 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md overflow-hidden flex items-center justify-center relative ring-2 ring-transparent group-hover:ring-black/5">
                      <img
                        src={c.image || fallbackImage}
                        alt={c.name}
                        className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors text-center whitespace-nowrap">
                      {c.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {categories.map((c: any, index: number) => {
          // Filter products for this specific category
          const catProducts = products.filter((p: any) =>
            p.category?.toUpperCase() === c.name?.toUpperCase() ||
            p.category?.toUpperCase() === c.slug?.toUpperCase()
          );

          // Hide section if there are no products
          if (catProducts.length === 0) return null;

          const bgColor = index % 2 === 0 ? "bg-white" : "bg-gray-50";
          const fallbackImage = index % 2 === 0 ? "/images/banners/Category_Banner_1.avif" : "/images/banners/Category_Banner_1.avif";

          return (
            <div key={c._id || index} className={`${bgColor} py-12`}>
              <SocksPromotionSection
                category={c.name}
                title={c.name}
                subtitle="COLLECTION"
                description={c.description || `Discover our premium ${c.name} collection. Engineered for comfort and style.`}
                bannerImage={c.image || fallbackImage}
                products={catProducts}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
