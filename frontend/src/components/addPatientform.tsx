import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const emergencyContactSchema = z.object({
  name: z.string().min(1, "Emergency contact name is required"),
  relation: z.string().min(1, "Relation is required"),
  contact: z.string().min(1, "Contact number is required"),
});

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  diseases: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
  age: z.number().min(0).max(150, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  contactInfo: z.string().min(1, "Contact information is required"),
  emergencyContact: emergencyContactSchema,
  status: z.enum(["active", "discharged"]).default("active"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface AddPatientFormProps {
  onSubmit: (data: PatientFormValues) => void;
  onClose: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      diseases: [],
      allergies: [],
      roomNumber: "",
      bedNumber: "",
      floorNumber: "",
      age: 0,
      gender: "male",
      contactInfo: "",
      emergencyContact: {
        name: "",
        relation: "",
        contact: "",
      },
      status: "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="floorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="diseases"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diseases</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter diseases (comma separated)"
                    {...field}
                    onChange={(e) => {
                      const diseases = e.target.value
                        .split(",")
                        .map((d) => d.trim())
                        .filter(Boolean);
                      field.onChange(diseases);
                    }}
                    value={field.value.join(", ")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter allergies (comma separated)"
                    {...field}
                    onChange={(e) => {
                      const allergies = e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean);
                      field.onChange(allergies);
                    }}
                    value={field.value.join(", ")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="emergencyContact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact.relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact.contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Patient</Button>
        </div>
      </form>
    </Form>
  );
};
