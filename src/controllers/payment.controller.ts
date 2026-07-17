import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Order } from '../models/order.model';
import { buildEsewaFormFields, verifyEsewaCallback } from '../services/payment.service';

export const initiateEsewaPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    const paymentData = buildEsewaFormFields({
      _id: order._id.toString(),
      totalPrice: order.totalPrice,
    });

    res.status(200).json(paymentData);
  } catch (error) {
    next(error);
  }
};

export const verifyEsewaPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;
    const decoded = verifyEsewaCallback(data);

    const order = await Order.findById(decoded.transaction_uuid);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'paid';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
