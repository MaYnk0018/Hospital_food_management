import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IPatient, IDiet } from "../types/random";

interface PatientDietViewProps {
  patient: IPatient;
  diet: IDiet;
}

export const PatientDietView: React.FC<PatientDietViewProps> = ({
  patient,
  diet,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderMealItems = (items: any[]) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border-b pb-2 last:border-0">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">
            Ingredients: {item.ingredients.join(", ")}
          </p>
          {item.specialInstructions.length > 0 && (
            <p className="text-sm text-red-600">
              Special Instructions: {item.specialInstructions.join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room</p>
              <p className="font-medium">{`${patient.floorNumber}-${patient.roomNumber}-${patient.bedNumber}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <p className="font-medium">
                {patient.allergies.join(", ") || "None"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Diseases</p>
              <p className="font-medium">{patient.diseases.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Diet Plan for {new Date(diet.date).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(diet.meals).map(([mealTime, meal]) => (
              <div key={mealTime} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium capitalize">{mealTime}</h3>
                  <Badge className={getStatusColor(meal.status)}>
                    {meal.status}
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Ingredients</TableHead>
                      <TableHead>Special Instructions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meal.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.ingredients.join(", ")}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside">
                            {item.specialInstructions.map((instruction, i) => (
                              <li key={i} className="text-red-600">
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
