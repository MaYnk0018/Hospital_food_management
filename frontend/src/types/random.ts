import { Types } from "mongoose";

export interface IMealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
  _id?: string;
}

// Define the meal time status type
export type MealTimeStatus = "pending" | "preparing" | "delivered";

// Define the meal time type
export type MealTime = "morning" | "evening" | "night";

// Define the meal time interface
export interface IMealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

export interface IMeal {
  _id: string;
  date: string;
  meals: {
    morning: { items: IMealItem[]; status: string; _id: string };
    evening: { items: IMealItem[]; status: string; _id: string };
    night: { items: IMealItem[]; status: string; _id: string };
  };
  patientId: {
    _id: string;
    name: string;
    roomNumber: string;
    bedNumber: string;
  };
}

export interface IMeals {
  meal: IMeal; // Make sure to include this property
  className?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: "manager" | "pantry" | "delivery";
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  role: "manager" | "pantry" | "delivery";
  name: string;
  contact: string;
  createdAt: Date;
}

export interface IEmergencyContact {
  name: string;
  relation: string;
  contact: string;
}

export interface IPatient {
  _id: Types.ObjectId;
  name: string;
  diseases: string[];
  allergies: string[];
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  age: number;
  gender: string;
  contactInfo: string;
  emergencyContact: IEmergencyContact;
  status: "active" | "discharged";
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
  _id: string; // Updated to string as you're using toString() in JSX
  dietId: {
    _id: string;
    patientId: {
      name: string;
      roomNumber: string;
      bedNumber: string;
    };
    meals: {
      morning: { _id: string; items: any[]; status: string };
      evening: { _id: string; items: any[]; status: string };
      night: { _id: string; items: any[]; status: string };
    };
  };
  assignedTo?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  mealTime: "morning" | "evening" | "night";
  status: "assigned" | "in-progress" | "delivered";
  deliveredAt?: Date;
  notes?: string;
}

// export interface IDelivery {
//   _id: Types.ObjectId;
//   dietId: Types.ObjectId;
//   assignedTo?: {
//     name?: string;
//     email?: string;
//     contact?: string;
//     _id?: string;
//     patientName?: string;
//     roomNumber?: string;
//   };
//   mealTime: "morning" | "evening" | "night";
//   status: "assigned" | "in-progress" | "delivered";
//   patientDetails?: {
//     name: string;
//     roomNumber: string;
//     bedNumber: string;
//   };
//   deliveredAt?: Date;
//   notes?: string;
// }

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
