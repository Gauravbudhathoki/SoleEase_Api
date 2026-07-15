import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authResult = await authService.registerUser(req.body);
    res.status(201).json(authResult);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authResult = await authService.loginUser(req.body);
    res.status(200).json(authResult);
  } catch (error) {
    next(error);
  }
};
