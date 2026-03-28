
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/mern-ecommerce';
const productId = '69b0a0e65d80f03226b9e5bd';

async function updateProduct() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const products = db.collection('products');

        const result = await products.updateOne(
            { _id: new mongoose.Types.ObjectId(productId) },
            { $set: { comparePrice: 1200 } }
        );

        if (result.matchedCount > 0) {
            console.log(`Success: Updated product ${productId}`);
            const updated = await products.findOne({ _id: new mongoose.Types.ObjectId(productId) });
            console.log('Final data:', JSON.stringify(updated, null, 2));
        } else {
            console.log(`Error: Product ${productId} not found`);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

updateProduct();
