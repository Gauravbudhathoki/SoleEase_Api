import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/product.model';

const products = [
  {
    name: 'AeroStride Elite 2.0',
    description: 'Performance-grade runner with responsive cushioning.',
    price: 180,
    brand: 'Stride Performance',
    category: 'women',
    sizes: [5, 6, 7, 8, 9, 10, 11],
    colors: ['black', 'white', 'pink'],
    stock: 30,
    images: ['/images/aerostride-elite.jpg'],
    isFeatured: true,
  },
  {
    name: 'Urban Kinetic Platform',
    description: 'Chunky platform sneaker for everyday style.',
    price: 145,
    brand: 'Vanguard Sport',
    category: 'women',
    sizes: [5, 6, 7, 8, 9],
    colors: ['black', 'white'],
    stock: 25,
    images: ['/images/urban-kinetic.jpg'],
    isFeatured: false,
  },
  {
    name: 'Zenith Trail Runner',
    description: 'Rugged trail shoe with all-terrain grip.',
    price: 210,
    brand: 'Vanguard Sport',
    category: 'women',
    sizes: [6, 7, 8, 9, 10],
    colors: ['orange', 'grey'],
    stock: 20,
    images: ['/images/zenith-trail.jpg'],
    isFeatured: false,
  },
  {
    name: 'Sculpted Terra Boot',
    description: 'Refined Chelsea boot in premium leather.',
    price: 195,
    brand: 'Sole Classics',
    category: 'women',
    sizes: [5, 6, 7, 8, 9],
    colors: ['tan', 'black'],
    stock: 18,
    images: ['/images/sculpted-terra.jpg'],
    isFeatured: false,
  },
  {
    name: 'Gravity Shift Pro',
    description: 'Lightweight training shoe built for movement.',
    price: 225,
    brand: 'Stride Performance',
    category: 'women',
    sizes: [6, 7, 8, 9, 10],
    colors: ['grey'],
    stock: 22,
    images: [],
    isFeatured: false,
  },
  {
    name: 'Heritage Low-Top',
    description: 'Classic low-top sneaker, now on sale.',
    price: 95,
    brand: 'Sole Classics',
    category: 'women',
    sizes: [5, 6, 7, 8, 9, 10],
    colors: ['white'],
    stock: 15,
    images: [],
    isFeatured: false,
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
