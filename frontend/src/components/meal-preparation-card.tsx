import React, { useState } from "react";
import { ChefHat, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMealItem, IMeals } from "../types/random";

// interface Props {
//   meal: {
//     meals: {
//       morning: {
//         items: IMealItem[];
//         status: string;
//         _id: string;
//       };
//       evening: {
//         items: IMealItem[];
//         status: string;
//         _id: string;
//       };
//       night: {
//         items: IMealItem[];
//         status: string;
//         _id: string;
//       };
//     };
//     patientId: {
//       _id: string;
//       name: string;
//       roomNumber: string;
//       bedNumber: string;
//     };
//     _id: string;
//     date: string;
//   };
//   className?: string;
// }

const MealPreparationCard: React.FC<IMeals> = ({
  className = "",
  ...props
}) => {
  const { meal } = props;
  const [selectedMealTime, setSelectedMealTime] = useState<string | null>(null);
  const [deliveryPersonDetails, setDeliveryPersonDetails] = useState({
    name: "",
    email: "",
    contact: "",
    dietId: meal._id,
    mealTime: "",
  });

  // Update delivery person details when meal time is selected
  React.useEffect(() => {
    if (selectedMealTime) {
      setDeliveryPersonDetails((prev) => ({
        ...prev,
        mealTime: selectedMealTime,
        dietId: meal._id,
      }));
    }
  }, [selectedMealTime, meal._id]);

  const resetDeliveryDialog = () => {
    setSelectedMealTime(null);
    setDeliveryPersonDetails({
      name: "",
      email: "",
      contact: "",
      dietId: meal._id,
      mealTime: "",
    });
  };

  const statusOptions = ["pending", "preparing", "delivered"];
  const mealTimes = Object.entries(meal.meals);

  const onStatusUpdate = async (
    dietId: string,
    mealTime: string,
    status: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pantry/preparations/${dietId}/${mealTime}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const data = await response.json();
      console.log("Status updated successfully:", data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating status:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const handleAssignDelivery = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedMealTime) return;

      // Send all delivery person details and meal information in a single request
      const response = await fetch(
        `process.env.BACKEND_URL}/api/pantry/deliveries/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: deliveryPersonDetails.email,
            name: deliveryPersonDetails.name,
            contact: deliveryPersonDetails.contact,
            dietId: meal._id,
            mealTime: selectedMealTime,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign delivery");
      }

      const data = await response.json();
      console.log("Delivery assigned successfully:", data);

      // Close dialog and reset form
      resetDeliveryDialog();

      // Update meal status to reflect assignment
      await onStatusUpdate(meal._id, selectedMealTime, "preparing");
    } catch (error) {
      console.error("Error in delivery assignment:", error);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          <ChefHat className="inline mr-2" />
          Patient: {meal.patientId.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Room: {meal.patientId.roomNumber}</p>
            <p className="font-semibold">Bed: {meal.patientId.bedNumber}</p>
          </div>

          {mealTimes.map(([time, mealTime]) => (
            <div key={time} className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold capitalize">{time}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMealTime(time)}
                  className="flex items-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  Assign Delivery
                </Button>
              </div>

              {mealTime.items.map((item, idx) => (
                <div key={idx}>
                  <p className="font-medium">{item.name}</p>
                  <div className="ml-4">
                    <p>Ingredients:</p>
                    <ul className="list-disc pl-5">
                      {item.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                    {item.specialInstructions.length > 0 && (
                      <>
                        <p>Special Instructions:</p>
                        <ul className="list-disc pl-5">
                          {item.specialInstructions.map((instruction, i) => (
                            <li key={i}>{instruction}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-2">
                <label className="font-semibold block mb-2">Status:</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={mealTime.status}
                  onChange={(e) =>
                    onStatusUpdate(meal._id, time, e.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Delivery Assignment Dialog */}
      <Dialog open={!!selectedMealTime} onOpenChange={resetDeliveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Delivery - {selectedMealTime?.toUpperCase()} Meal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Delivery Person Name</Label>
              <Input
                id="name"
                value={deliveryPersonDetails.name}
                onChange={(e) =>
                  setDeliveryPersonDetails({
                    ...deliveryPersonDetails,
                    name: e.target.value,
                  })
                }
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={deliveryPersonDetails.email}
                onChange={(e) =>
                  setDeliveryPersonDetails({
                    ...deliveryPersonDetails,
                    email: e.target.value,
                  })
                }
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={deliveryPersonDetails.contact}
                onChange={(e) =>
                  setDeliveryPersonDetails({
                    ...deliveryPersonDetails,
                    contact: e.target.value,
                  })
                }
                placeholder="Enter contact number"
              />
            </div>
            <Button onClick={handleAssignDelivery} className="w-full">
              Assign Delivery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MealPreparationCard;
