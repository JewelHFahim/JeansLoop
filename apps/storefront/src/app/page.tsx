'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productsApi, categoriesApi } from '@/lib/api';
import { ArrowRight } from 'lucide-react';
import { CategoryPromoSection } from '@/components/home/CategoryPromoSection';
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
          const fallbackImage = index % 2 === 0
            ? "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1473966968600-fa804b86862b?q=80&w=1000&auto=format&fit=crop";

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
