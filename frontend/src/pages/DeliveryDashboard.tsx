import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, TruckIcon } from "lucide-react";

// Types based on the Mongoose model
interface Delivery {
  _id: string;
  dietId: {
    _id: string;
    patientName: string;
    roomNumber: string;
  };
  mealTime: "morning" | "evening" | "night";
  status: "assigned" | "in-progress" | "delivered";
  deliveredAt?: Date;
  notes?: string;
}

const DeliveryManagement = () => {
  // Sample data - in real app would come from API
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      _id: "1",
      dietId: {
        _id: "d1",
        patientName: "John Doe",
        roomNumber: "301",
      },
      mealTime: "morning",
      status: "assigned",
    },
    {
      _id: "2",
      dietId: {
        _id: "d2",
        patientName: "Jane Smith",
        roomNumber: "405",
      },
      mealTime: "evening",
      status: "in-progress",
    },
  ]);

  const [activeDelivery, setActiveDelivery] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");

  const handleStatusUpdate = (
    deliveryId: string,
    newStatus: Delivery["status"]
  ) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) => {
        if (delivery._id === deliveryId) {
          return {
            ...delivery,
            status: newStatus,
            deliveredAt: newStatus === "delivered" ? new Date() : undefined,
          };
        }
        return delivery;
      })
    );

    if (newStatus === "delivered") {
      setActiveDelivery(null);
      setDeliveryNote("");
    }
  };

  const getStatusIcon = (status: Delivery["status"]) => {
    switch (status) {
      case "assigned":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "in-progress":
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Assigned Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">
                      {delivery.dietId.patientName} - Room{" "}
                      {delivery.dietId.roomNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Meal Time:{" "}
                      {delivery.mealTime.charAt(0).toUpperCase() +
                        delivery.mealTime.slice(1)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(delivery.status)}
                    <span className="text-sm capitalize">
                      {delivery.status}
                    </span>
                  </div>
                </div>

                {delivery.status !== "delivered" && (
                  <div className="space-y-4">
                    {activeDelivery === delivery._id && (
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
                            handleStatusUpdate(delivery._id, "in-progress")
                          }
                          variant="outline"
                        >
                          Start Delivery
                        </Button>
                      )}
                      {delivery.status === "in-progress" && (
                        <>
                          <Button
                            onClick={() => setActiveDelivery(delivery._id)}
                            variant="outline"
                          >
                            Add Notes
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusUpdate(delivery._id, "delivered")
                            }
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Mark as Delivered
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryManagement;
