import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, TruckIcon, X } from "lucide-react";
import { IDelivery } from "@/types/random";

// Alert component
interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    <span>{message}</span>
    <button onClick={onClose} className="p-1">
      <X className="h-4 w-4" />
    </button>
  </div>
);

// Types based on your Mongoose model
// interface Delivery {
//   _id: string;
//   dietId: {
//     _id: string;
//     patientName: string;
//     roomNumber: string;
//   };
//   mealTime: "morning" | "evening" | "night";
//   status: "assigned" | "in-progress" | "delivered";
//   deliveredAt?: Date;
//   notes?: string;
// }

interface AlertState {
  message: string;
  type: "success" | "error";
}

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Fetch delivery assignments
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/deliveries/assignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        setAlert({
          message: "Failed to load delivery assignments",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleStatusUpdate = async (
    deliveryId: string,
    newStatus: IDelivery["status"]
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/delivery/assignments/${deliveryId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            notes: deliveryNote,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedDelivery = await response.json();

      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery._id.toString() === deliveryId ? updatedDelivery : delivery
        )
      );

      setAlert({
        message: `Delivery status updated to ${newStatus}`,
        type: "success",
      });

      if (newStatus === "delivered") {
        setActiveDelivery(null);
        setDeliveryNote("");
      }
    } catch (error) {
      setAlert({
        message: "Failed to update delivery status",
        type: "error",
      });
    }
  };

  const getStatusIcon = (status: IDelivery["status"]) => {
    switch (status) {
      case "assigned":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "in-progress":
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assigned Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No deliveries assigned
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div
                  key={delivery._id.toString()}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    {/* Patient Information */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          Patient: {delivery.dietId.patientId.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Room: {delivery.dietId.patientId.roomNumber} | Bed:{" "}
                          {delivery.dietId.patientId.bedNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(delivery.status)}
                        <span className="text-sm capitalize px-2 py-1 bg-gray-100 rounded">
                          {delivery.status}
                        </span>
                      </div>
                    </div>

                    {/* Meal Information */}
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">
                        {delivery.mealTime.charAt(0).toUpperCase() +
                          delivery.mealTime.slice(1)}{" "}
                        Meal Details
                      </h4>
                      {delivery.dietId.meals[delivery.mealTime].items.map(
                        (meal) => (
                          <div key={meal._id} className="space-y-1">
                            <p className="text-sm font-medium">{meal.name}</p>
                            {meal.ingredients.length > 0 && (
                              <p className="text-sm text-gray-600">
                                Ingredients: {meal.ingredients.join(", ")}
                              </p>
                            )}
                            {meal.specialInstructions.length > 0 && (
                              <div className="text-sm text-orange-600">
                                Special Instructions:{" "}
                                {meal.specialInstructions.join(", ")}
                              </div>
                            )}
                          </div>
                        )
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Meal Status:{" "}
                        <span className="capitalize">
                          {delivery.dietId.meals[delivery.mealTime].status}
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {delivery.status !== "delivered" && (
                      <div className="space-y-4 mt-2">
                        {activeDelivery === delivery._id.toString() && (
                          <Textarea
                            placeholder="Add delivery notes (optional)"
                            value={deliveryNote}
                            onChange={(e) => setDeliveryNote(e.target.value)}
                            className="mt-2"
                          />
                        )}
                        <div className="flex gap-2">
                          {delivery.status === "assigned" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(delivery._id.toString(), "in-progress")
                              }
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100"
                            >
                              Start Delivery
                            </Button>
                          )}
                          {delivery.status === "in-progress" && (
                            <>
                              <Button
                                onClick={() => setActiveDelivery(delivery._id.toString())}
                                variant="outline"
                              >
                                Add Notes
                              </Button>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(delivery._id.toString(), "delivered")
                                }
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Mark as Delivered
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryManagement;
