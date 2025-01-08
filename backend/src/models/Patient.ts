import { Schema, model, Document } from "mongoose";

type IEmergencyContact={
    name: string;
    relation: string;
    contact: string;
}

export interface IPatient extends Document {
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

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  diseases: [{ type: String }],
  allergies: [{ type: String }],
  roomNumber: { type: String, required: true },
  bedNumber: { type: String, required: true },
  floorNumber: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactInfo: { type: String, required: true },
  emergencyContact: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    contact: { type: String, required: true }
  },
  status: { type: String, enum: ['active', 'discharged'], default: 'active' }
});


export const Patient = model<IPatient>('Patient', patientSchema);