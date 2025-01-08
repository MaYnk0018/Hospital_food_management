import { Schema, model, Document, Types } from 'mongoose';

export interface IDelivery extends Document {
  dietId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  mealTime: 'morning' | 'evening' | 'night';
  status: 'assigned' | 'in-progress' | 'delivered';
  deliveredAt?: Date;
  notes?: string;
}

const deliverySchema = new Schema<IDelivery>({
  dietId: { type: Schema.Types.ObjectId, ref: 'Diet', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  mealTime: { 
    type: String, 
    enum: ['morning', 'evening', 'night'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['assigned', 'in-progress', 'delivered'], 
    default: 'assigned' 
  },
  deliveredAt: { type: Date },
  notes: { type: String }
});

export const Delivery = model<IDelivery>('Delivery', deliverySchema);