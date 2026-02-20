import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jeansloop';

const demoProducts = [
    {
        name: 'Dark Indigo Cargo Denim',
        slug: 'dark-indigo-cargo-denim',
        description: 'Elite cargo denim with reinforced pockets and premium indigo finish. Built for durability and style.',
        price: 2450,
        category: 'JEANS',
        images: ['https://images.unsplash.com/photo-1542272617-08f086320079?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'JNS-CRG-30', size: '30', color: 'INDIGO', price: 2450, stock: 50 },
        ],
        isDraft: false,
    },
    {
        name: 'Black Stretch Slim Jeans',
        slug: 'black-stretch-slim-jeans',
        description: 'Ultra-flexible black denim for maximum comfort. Retains shape after every wash.',
        price: 1850,
        category: 'JEANS',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'JNS-SLM-32', size: '32', color: 'BLACK', price: 1850, stock: 30 },
        ],
        isDraft: false,
    },
    {
        name: 'Classic Twill Chino - Khaki',
        slug: 'classic-twill-chino-khaki',
        description: 'Premium cotton twill chinos. The perfect balance between formal and casual.',
        price: 1650,
        category: 'TWILL',
        images: ['https://images.unsplash.com/photo-1473966968600-fa804b86862b?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TWL-CHK-30', size: '30', color: 'KHAKI', price: 1650, stock: 40 },
        ],
        isDraft: false,
    },
    {
        name: 'Navy Performance Twill',
        slug: 'navy-performance-twill',
        description: 'Wrinkle-resistant twill fabric for the busy professional. Exceptional breathability.',
        price: 1750,
        category: 'TWILL',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TWL-NVY-32', size: '32', color: 'NAVY', price: 1750, stock: 25 },
        ],
        isDraft: false,
    },
    {
        name: 'Essential Jogger Trouser',
        slug: 'essential-jogger-trouser',
        description: 'Modern jogger cut with refined trouser tailoring. Ideal for urban movement.',
        price: 1450,
        category: 'TROUSER',
        images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TRS-JGR-M', size: 'M', color: 'GREY', price: 1450, stock: 60 },
        ],
        isDraft: false,
    },
    {
        name: 'Tailored Wool Trouser',
        slug: 'tailored-wool-trouser',
        description: 'Premium wool blend trousers. Sharp silhouette for executive presence.',
        price: 2850,
        category: 'TROUSER',
        images: ['https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TRS-WOL-34', size: '34', color: 'CHARCOAL', price: 2850, stock: 15 },
        ],
        isDraft: false,
    },
    {
        name: 'Vintage Blue Jeans',
        slug: 'vintage-blue-jeans',
        description: 'Authentic vintage look with modern comfort.',
        price: 2100,
        category: 'JEANS',
        images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'JNS-VNT-34', size: '34', color: 'BLUE', price: 2100, stock: 20 },
        ],
        isDraft: false,
    },
    {
        name: 'Grey Fit Denim',
        slug: 'grey-fit-denim',
        description: 'Modern grey wash denim for any occasion.',
        price: 1950,
        category: 'JEANS',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'JNS-GRY-30', size: '30', color: 'GREY', price: 1950, stock: 35 },
        ],
        isDraft: false,
    },
    {
        name: 'Olive Twill Cargo',
        slug: 'olive-twill-cargo',
        description: 'Functional cargo style in soft olive twill.',
        price: 1550,
        category: 'TWILL',
        images: ['https://images.unsplash.com/photo-1473966968600-fa804b86862b?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TWL-OLV-32', size: '32', color: 'OLIVE', price: 1550, stock: 45 },
        ],
        isDraft: false,
    },
    {
        name: 'Sandstone Twill Chino',
        slug: 'sandstone-twill-chino',
        description: 'Classic sandstone chinos for a clean look.',
        price: 1600,
        category: 'TWILL',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TWL-SND-30', size: '30', color: 'SAND', price: 1600, stock: 30 },
        ],
        isDraft: false,
    },
    {
        name: 'Linen Blend Trouser',
        slug: 'linen-blend-trouser',
        description: 'Lightweight linen blend for ultimate breathability.',
        price: 1800,
        category: 'TROUSER',
        images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TRS-LIN-L', size: 'L', color: 'BEIGE', price: 1800, stock: 25 },
        ],
        isDraft: false,
    },
    {
        name: 'Checkered Smart Trouser',
        slug: 'checkered-smart-trouser',
        description: 'Subtle check pattern for a modern smart-casual vibe.',
        price: 2300,
        category: 'TROUSER',
        images: ['https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?q=80&w=1000&auto=format&fit=crop'],
        variants: [
            { sku: 'TRS-CHK-32', size: '32', color: 'NAVY_CHECK', price: 2300, stock: 15 },
        ],
        isDraft: false,
    }
];


const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected to:', MONGO_URI);

        // Optional: Clear existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products.`);

        const insertResult = await Product.insertMany(demoProducts);
        console.log(`Seeded ${insertResult.length} products successfully.`);

        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
