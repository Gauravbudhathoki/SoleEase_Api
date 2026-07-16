import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/product.model';

const products = [
  {
    name: 'AeroStride Pro 1.0',
    description: 'Lightweight performance running shoe built for speed.',
    price: 145,
    brand: 'Stride Performance',
    category: 'men',
    sizes: [7, 8, 9, 10, 11],
    colors: ['red', 'white'],
    stock: 40,
    images: ['/images/aerostride-pro.jpg'],
    isFeatured: true,
  },
  {
    name: 'Heritage Oxford',
    description: 'Classic leather oxford with timeless craftsmanship.',
    price: 280,
    brand: 'Sole Classics',
    category: 'men',
    sizes: [8, 9, 10, 11],
    colors: ['brown'],
    stock: 20,
    images: ['/images/heritage-oxford.jpg'],
    isFeatured: false,
  },
  {
    name: 'Vanguard Stealth',
    description: 'Sleek all-black sneaker for everyday performance.',
    price: 110,
    brand: 'Vanguard Sport',
    category: 'men',
    sizes: [7, 8, 9, 10],
    colors: ['black'],
    stock: 35,
    images: ['/images/vanguard-stealth.jpg'],
    isFeatured: false,
  },
  {
    name: 'Urban Chelsea',
    description: 'Tan suede Chelsea boot for city streets.',
    price: 210,
    brand: 'Sole Classics',
    category: 'men',
    sizes: [8, 9, 10, 11, 12],
    colors: ['tan', 'black', 'navy'],
    stock: 25,
    images: ['/images/urban-chelsea.jpg'],
    isFeatured: false,
  },
  {
    name: 'Cloud Walker 2',
    description: 'Ultra-light everyday sneaker in clean white.',
    price: 130,
    brand: 'Stride Performance',
    category: 'men',
    sizes: [7, 8, 9, 10, 11],
    colors: ['white'],
    stock: 30,
    images: ['/images/cloud-walker.jpg'],
    isFeatured: false,
  },
  {
    name: 'Executive Loafer',
    description: 'Polished black leather loafer for the office.',
    price: 240,
    brand: 'Sole Classics',
    category: 'men',
    sizes: [9, 10, 11],
    colors: ['black'],
    stock: 15,
    images: ['/images/executive-loafer.jpg'],
    isFeatured: false,
  },
  {
    name: 'Summit Trail X',
    description: 'Rugged trail runner built for off-road terrain.',
    price: 155,
    brand: 'Vanguard Sport',
    category: 'men',
    sizes: [8, 9, 10, 11],
    colors: ['green', 'brown'],
    stock: 22,
    images: ['/images/summit-trail.jpg'],
    isFeatured: false,
  },
  {
    name: 'Marina Suede Loafer',
    description: 'Navy suede loafer with a relaxed, refined fit.',
    price: 195,
    brand: 'Sole Classics',
    category: 'men',
    sizes: [8, 9, 10, 11],
    colors: ['navy'],
    stock: 18,
    images: ['/images/marina-suede.jpg'],
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
