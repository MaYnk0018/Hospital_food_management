import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ClipboardList,
  Users,
  TruckIcon,
  Calendar,
  PlusCircle,
  FileText,
} from "lucide-react";

// Previous interfaces remain the same...

interface AddPatientFormData {
  name: string;
  diseases: string[];
  allergies: string[];
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  age: number;
  gender: string;
  contactInfo: string;
  emergencyContact: {
    name: string;
    relation: string;
    contact: string;
  };
  status: "active" | "discharged";
}

export const AddPatientForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState<AddPatientFormData>({
    name: "",
    diseases: [],
    allergies: [],
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    age: 0,
    gender: "",
    contactInfo: "",
    emergencyContact: {
      name: "",
      relation: "",
      contact: "",
    },
    status: "active",
  });

  const [error, setError] = useState<string>("");
  const [newDisease, setNewDisease] = useState<string>("");
  const [newAllergy, setNewAllergy] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("emergency.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddDisease = () => {
    if (newDisease) {
      setFormData((prev) => ({
        ...prev,
        diseases: [...prev.diseases, newDisease],
      }));
      setNewDisease("");
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy],
      }));
      setNewAllergy("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Patient Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Number</Label>
          <Input
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floorNumber">Floor Number</Label>
          <Input
            id="floorNumber"
            name="floorNumber"
            value={formData.floorNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedNumber">Bed Number</Label>
          <Input
            id="bedNumber"
            name="bedNumber"
            value={formData.bedNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Diseases</Label>
        <div className="flex space-x-2">
          <Input
            value={newDisease}
            onChange={(e) => setNewDisease(e.target.value)}
            placeholder="Add disease"
          />
          <Button type="button" onClick={handleAddDisease}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.diseases.map((disease, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              {disease}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Allergies</Label>
        <div className="flex space-x-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Add allergy"
          />
          <Button type="button" onClick={handleAddAllergy}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.allergies.map((allergy, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded"
            >
              {allergy}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency.name">Name</Label>
            <Input
              id="emergency.name"
              name="emergency.name"
              value={formData.emergencyContact.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency.relation">Relation</Label>
            <Input
              id="emergency.relation"
              name="emergency.relation"
              value={formData.emergencyContact.relation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency.contact">Contact</Label>
            <Input
              id="emergency.contact"
              name="emergency.contact"
              value={formData.emergencyContact.contact}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Patient</Button>
      </div>
    </form>
  );
};

// Update the Dialog content in the original dashboard
// Replace the DialogContent section with:

// Rest of the dashboard component remains the same...
