import { Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { shippingAddress } = req.body;

    const order = await orderService.createOrder({
      userId: req.user!.id,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const order = await orderService.getOrderById(req.params.id, req.user!.id, isAdmin);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
