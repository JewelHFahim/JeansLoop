import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SliderModel } from './src/models/Slider';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce';

const defaultSlides = [
    {
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
        title: 'Elevate Your \\n Everyday',
        subtitle: 'Premium menswear designed for the modern gentleman. Discover quality craftsmanship and contemporary style.',
        primaryCta: { text: 'Shop All Models', href: '/shop' },
        secondaryCta: { text: 'Browse Denim', href: '/shop?category=JEANS' },
        order: 1,
        isActive: true,
    },
    {
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop',
        title: 'Precision \\n Tailoring',
        subtitle: 'Sharp silhouettes and precision tailoring. Designed for professionals who demand excellence in every detail.',
        primaryCta: { text: 'Explore Tailored', href: '/shop?category=TROUSER' },
        secondaryCta: { text: 'View Collection', href: '/shop' },
        order: 2,
        isActive: true,
    },
    {
        image: 'https://images.unsplash.com/photo-1473966968600-fa804b86862b?q=80&w=2000&auto=format&fit=crop',
        title: 'Classic \\n Twill',
        subtitle: 'Versatile and refined cotton twill. The essential choice for a sophisticated casual look that stays crisp all day.',
        primaryCta: { text: 'Shop Twill', href: '/shop?category=TWILL' },
        order: 3,
        isActive: true,
    },
];

async function seedSliders() {
    try {
        console.log('Connecting to DB at:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        console.log('Deleting existing sliders...');
        await SliderModel.deleteMany({});

        console.log('Inserting default sliders...');
        await SliderModel.insertMany(defaultSlides);

        console.log('Slider seed successful!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding sliders:', error);
        process.exit(1);
    }
}

seedSliders();
