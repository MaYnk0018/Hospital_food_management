import { Types } from 'mongoose';

export interface IPantryStaff {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  location: string;
  specialization?: string[];
  isAvailable: boolean;
  assignedTasks: Types.ObjectId[];
}

export interface IPreparationTask {
  _id: Types.ObjectId;
  dietId: Types.ObjectId;
  assignedTo: Types.ObjectId;
  mealTime: 'morning' | 'evening' | 'night';
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  startTime?: Date;
  completionTime?: Date;
  notes?: string;
  specialInstructions?: string[];
}
