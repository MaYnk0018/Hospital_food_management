// types/pantry.ts
import { Types } from 'mongoose';

export interface IMealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

export interface IMeal {
  _id: string;
  items: IMealItem[];
  status: 'pending' | 'preparing' | 'delivered';
  patientId: string;
}

export interface IDiet {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  date: Date;
  meals: {
    morning: IMeal;
    evening: IMeal;
    night: IMeal;
  };
}

export interface IDelivery {
  _id: string;
  dietId: Types.ObjectId;
  assignedTo?: {
    name: string;
    email: string;
    contact: string;
  };
  mealTime: 'morning' | 'evening' | 'night';
  status: 'assigned' | 'in-progress' | 'delivered';
  patientDetails?: {
    name: string;
    roomNumber: string;
    bedNumber: string;
  };
  deliveredAt?: Date;
  notes?: string;
}

export interface IPantryStats {
  totalPreparations: number;
  activeDeliveries: number;
  completedDeliveries: number;
}

export type StatusUpdateFn = (id: string, status: string) => Promise<void>;

// Component Props Types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface StatsCardProps extends BaseProps {
  title: string;
  value: number;
}

export interface MealPreparationCardProps extends BaseProps {
  meal: IMeal;
  onStatusUpdate: StatusUpdateFn;
}

export interface DeliveryCardProps extends BaseProps {
  delivery: IDelivery;
  onStatusUpdate: StatusUpdateFn;
}

export interface TabsProps extends BaseProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface TabTriggerProps extends BaseProps {
  value: string;
}

export interface DeliveryCardProps {
  delivery: IDelivery;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  className?: string;
}