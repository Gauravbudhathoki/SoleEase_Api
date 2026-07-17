import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/product.model';

const CONVERSION_RATE = 135;

const convert = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const products = await Product.find();
  console.log(`Found ${products.length} products to convert`);

  for (const product of products) {
    const newPrice = Math.round((product.price * CONVERSION_RATE) / 50) * 50;
    product.price = newPrice;
    await product.save();
    console.log(`${product.name}: Rs. ${newPrice}`);
  }

  console.log('Done!');
  await mongoose.disconnect();
  process.exit(0);
};

convert().catch((err) => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
