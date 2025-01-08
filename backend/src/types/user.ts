// types/user.ts
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'manager' | 'pantry' | 'delivery';
  name: string;
  contact: string;
  createdAt: Date;
}

export interface SignupRequest {
  email: string;
  password: string;
  role: 'manager' | 'pantry' | 'delivery';
  name: string;
  contact: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    contact: string;
  };
}