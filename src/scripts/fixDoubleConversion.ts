import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/product.model';

const CONVERSION_RATE = 135;

const fix = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const products = await Product.find();
  console.log(`Found ${products.length} products to fix`);

  for (const product of products) {
    const correctedPrice = Math.round(product.price / CONVERSION_RATE / 50) * 50;
    console.log(`${product.name}: ${product.price} -> Rs. ${correctedPrice}`);
    product.price = correctedPrice;
    await product.save();
  }

  console.log('Done!');
  await mongoose.disconnect();
  process.exit(0);
};

fix().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});
