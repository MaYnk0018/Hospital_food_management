import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Truck } from "lucide-react";
import { IDelivery } from "../types/random";

interface DeliveryStatusProps {
  deliveries: IDelivery[];
  onUpdateStatus: (
    deliveryId: string,
    status: "assigned" | "in-progress" | "delivered"
  ) => void;
}

export const DeliveryStatus: React.FC<DeliveryStatusProps> = ({
  deliveries,
  onUpdateStatus,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in-progress":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery._id.toString()}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(delivery.status)}
                <div>
                  <p className="font-medium capitalize">
                    {delivery.mealTime} Meal
                  </p>
                  {delivery.deliveredAt && (
                    <p className="text-sm text-gray-500">
                      Delivered at:{" "}
                      {new Date(delivery.deliveredAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(delivery.status)}>
                  {delivery.status}
                </Badge>
                {delivery.status !== "delivered" && (
                  <select
                    className="border rounded p-1"
                    value={delivery.status}
                    onChange={(e) =>
                      onUpdateStatus(
                        delivery._id.toString(),
                        e.target.value as
                          | "assigned"
                          | "in-progress"
                          | "delivered"
                      )
                    }
                  >
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
              </div>

              {delivery.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  Notes: {delivery.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
