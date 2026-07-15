import { Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const cart = await cartService.addItem({
      userId: req.user!.id,
      productId,
      quantity: quantity || 1,
      size,
      color,
    });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color, quantity } = req.body;

    const cart = await cartService.updateItemQuantity({
      userId: req.user!.id,
      productId,
      size,
      color,
      quantity,
    });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color } = req.body;

    const cart = await cartService.removeItem({
      userId: req.user!.id,
      productId,
      size,
      color,
    });

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.clearCart(req.user!.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
