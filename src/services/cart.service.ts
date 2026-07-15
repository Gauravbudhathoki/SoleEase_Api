import { Cart, ICart } from '../models/cart.model';
import { Product } from '../models/product.model';

interface AddItemInput {
  userId: string;
  productId: string;
  quantity: number;
  size: number;
  color: string;
}

interface UpdateItemInput {
  userId: string;
  productId: string;
  size: number;
  color: string;
  quantity: number;
}

interface RemoveItemInput {
  userId: string;
  productId: string;
  size: number;
  color: string;
}

const notFoundError = (message: string) => {
  const error: Error & { statusCode?: number } = new Error(message);
  error.statusCode = 404;
  return error;
};

export const getCart = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const addItem = async (data: AddItemInput): Promise<ICart> => {
  const product = await Product.findById(data.productId);

  if (!product) {
    throw notFoundError('Product not found');
  }

  let cart = await Cart.findOne({ user: data.userId });

  if (!cart) {
    cart = await Cart.create({ user: data.userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === data.productId &&
      item.size === data.size &&
      item.color === data.color
  );

  if (existingItem) {
    existingItem.quantity += data.quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity: data.quantity,
      size: data.size,
      color: data.color,
    } as ICart['items'][number]);
  }

  await cart.save();
  return cart.populate('items.product');
};

export const updateItemQuantity = async (data: UpdateItemInput): Promise<ICart> => {
  const cart = await Cart.findOne({ user: data.userId });

  if (!cart) {
    throw notFoundError('Cart not found');
  }

  const item = cart.items.find(
    (i) =>
      i.product.toString() === data.productId &&
      i.size === data.size &&
      i.color === data.color
  );

  if (!item) {
    throw notFoundError('Item not found in cart');
  }

  item.quantity = data.quantity;
  await cart.save();
  return cart.populate('items.product');
};

export const removeItem = async (data: RemoveItemInput): Promise<ICart> => {
  const cart = await Cart.findOne({ user: data.userId });

  if (!cart) {
    throw notFoundError('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === data.productId &&
        item.size === data.size &&
        item.color === data.color
      )
  ) as ICart['items'];

  await cart.save();
  return cart.populate('items.product');
};

export const clearCart = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw notFoundError('Cart not found');
  }

  cart.items = [];
  await cart.save();
  return cart;
};
