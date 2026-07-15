import { Order, IOrder, OrderStatus, IShippingAddress } from '../models/order.model';
import { Cart } from '../models/cart.model';

interface CreateOrderInput {
  userId: string;
  shippingAddress: IShippingAddress;
}

const badRequestError = (message: string) => {
  const error: Error & { statusCode?: number } = new Error(message);
  error.statusCode = 400;
  return error;
};

const notFoundError = (message: string) => {
  const error: Error & { statusCode?: number } = new Error(message);
  error.statusCode = 404;
  return error;
};

export const createOrder = async (data: CreateOrderInput): Promise<IOrder> => {
  const cart = await Cart.findOne({ user: data.userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw badRequestError('Cart is empty');
  }

  const orderItems = cart.items.map((item) => {
    const product = item.product as unknown as {
      _id: string;
      name: string;
      price: number;
    };

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    };
  });

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: data.userId,
    items: orderItems,
    shippingAddress: data.shippingAddress,
    totalPrice,
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string, userId: string, isAdmin: boolean): Promise<IOrder> => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw notFoundError('Order not found');
  }

  if (!isAdmin && order.user.toString() !== userId) {
    const error: Error & { statusCode?: number } = new Error('Not authorized to view this order');
    error.statusCode = 403;
    throw error;
  }

  return order;
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  return Order.find().sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<IOrder> => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw notFoundError('Order not found');
  }

  return order;
};
