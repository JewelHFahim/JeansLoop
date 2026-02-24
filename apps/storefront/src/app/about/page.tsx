import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 italic">About Fire Cutter</h1>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="mb-6 text-xl font-medium">
                        Premium menswear designed for the modern gentleman. Quality, comfort, and style in every stitch.
                    </p>

                    <p className="mb-6">
                        Fire Cutter Export Collections was born from a simple idea: that premium quality menswear doesn't have to come with an inaccessible price tag. We specialize in high-quality denim, twill, and tailored trousers that bridge the gap between contemporary fashion and timeless durability.
                    </p>

                    <h2 className="text-2xl font-bold text-black uppercase tracking-widest mt-12 mb-4">Our Craftsmanship</h2>
                    <p className="mb-6">
                        Every piece in our collection is engineered for comfort and longevity. We use the finest indigo-dyed fabrics and sustainable cotton to ensure that your Fire Cutter garments only get better with age. Our anti-bacterial socks series represents our commitment to medical-grade protection and elite performance in everyday wear.
                    </p>

                    <h2 className="text-2xl font-bold text-black uppercase tracking-widest mt-12 mb-4">Our Values</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li><strong>Quality First:</strong> No compromises on materials or construction.</li>
                        <li><strong>Modern Design:</strong> Silhouettes that fit the way you live today.</li>
                        <li><strong>Sustainability:</strong> Conscious choices in our supply chain and fabrics.</li>
                    </ul>

                    <div className="mt-12 p-8 bg-gray-50 border-l-4 border-black">
                        <h3 className="text-xl font-bold mb-4">Join the Collection</h3>
                        <p className="mb-6">Explore our latest arrivals and experience the difference of elite craftsmanship.</p>
                        <Link href="/shop">
                            <Button className="rounded-none bg-black text-white hover:bg-gray-800 px-8 py-4 uppercase tracking-widest font-bold">
                                Shop Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
