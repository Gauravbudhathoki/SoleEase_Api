import { Product, IProduct } from '../models/product.model';

export interface ProductQuery {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new Product(data);
  return product.save();
};

export const getProducts = async (query: ProductQuery): Promise<IProduct[]> => {
  const filter: Record<string, unknown> = {};

  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = query.brand;
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) (filter.price as Record<string, number>).$gte = query.minPrice;
    if (query.maxPrice) (filter.price as Record<string, number>).$lte = query.maxPrice;
  }

  return Product.find(filter).sort({ createdAt: -1 });
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id);
};

export const updateProduct = async (
  id: string,
  data: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};