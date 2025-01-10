import React from "react";
import * as z from "zod";
declare const patientSchema: z.ZodObject<{
    name: z.ZodString;
    diseases: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    allergies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    roomNumber: z.ZodString;
    bedNumber: z.ZodString;
    floorNumber: z.ZodString;
    age: z.ZodNumber;
    gender: z.ZodEnum<["male", "female", "other"]>;
    contactInfo: z.ZodString;
    emergencyContact: z.ZodObject<{
        name: z.ZodString;
        relation: z.ZodString;
        contact: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        contact: string;
        relation: string;
    }, {
        name: string;
        contact: string;
        relation: string;
    }>;
    status: z.ZodDefault<z.ZodEnum<["active", "discharged"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "active" | "discharged";
    diseases: string[];
    allergies: string[];
    roomNumber: string;
    bedNumber: string;
    floorNumber: string;
    age: number;
    gender: "other" | "male" | "female";
    contactInfo: string;
    emergencyContact: {
        name: string;
        contact: string;
        relation: string;
    };
}, {
    name: string;
    roomNumber: string;
    bedNumber: string;
    floorNumber: string;
    age: number;
    gender: "other" | "male" | "female";
    contactInfo: string;
    emergencyContact: {
        name: string;
        contact: string;
        relation: string;
    };
    status?: "active" | "discharged" | undefined;
    diseases?: string[] | undefined;
    allergies?: string[] | undefined;
}>;
type PatientFormValues = z.infer<typeof patientSchema>;
interface AddPatientFormProps {
    onSubmit: (data: PatientFormValues) => void;
    onClose: () => void;
}
export declare const AddPatientForm: React.FC<AddPatientFormProps>;
export {};
