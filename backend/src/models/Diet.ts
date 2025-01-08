import { Schema, model, Document,Types } from "mongoose";

interface IMealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

interface IMeal {
  items: IMealItem[];
  status: "pending" | "preparing" | "delivered";
}

interface IMeals {
  morning: IMeal;
  evening: IMeal;
  night: IMeal;
}

export interface IDiet extends Document {
  patientId: Types.ObjectId;
  date: Date;
  meals: IMeals;
}

const mealItemSchema = new Schema<IMealItem>({
  name: String,
  ingredients: [String],
  specialInstructions: [String],
});

const mealSchema = new Schema<IMeal>({
  items: [mealItemSchema],
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered"],
    default: "pending",
  },
});


const dietSchema = new Schema<IDiet>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  date: { type: Date, required: true },
  meals: {
    morning: mealSchema,
    evening: mealSchema,
    night: mealSchema,
  },
});

export const Diet = model<IDiet>("Diet", dietSchema);
