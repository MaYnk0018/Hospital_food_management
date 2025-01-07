import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  role: "manager" | "pantry" | "delivery";
  name: string;
  contact: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["manager", "pantry", "delivery"],
    required: true,
  },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);