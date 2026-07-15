import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

const toAuthResult = (user: IUser): AuthResult => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token: generateToken(user.id),
});

export const registerUser = async (data: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    const error: Error & { statusCode?: number } = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create(data);
  return toAuthResult(user);
};

export const loginUser = async (data: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: data.email }).select('+password');

  if (!user) {
    const error: Error & { statusCode?: number } = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(data.password);

  if (!isMatch) {
    const error: Error & { statusCode?: number } = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return toAuthResult(user);
};