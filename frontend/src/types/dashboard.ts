import { Types } from 'mongoose';

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
  status: 'active' | 'discharged';
}

export interface IMealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

export interface IMeal {
  items: IMealItem[];
  status: "pending" | "preparing" | "delivered";
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
  _id: Types.ObjectId;
  dietId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  mealTime: 'morning' | 'evening' | 'night';
  status: 'assigned' | 'in-progress' | 'delivered';
  deliveredAt?: Date;
  notes?: string;
}
