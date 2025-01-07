import { Schema, model, Document } from "mongoose";

type IEmergencyContact={
    name: string;
    relation: string;
    contact: string;
}

interface IPatient extends Document {
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

const patientSchema= new Schema<IPatient>({
    
})
