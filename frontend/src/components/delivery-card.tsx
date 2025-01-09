import { Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeliveryCardProps } from "../types/pantry";

export const DeliveryCard = ({ 
  delivery, 
  onStatusUpdate, 
  className 
}: DeliveryCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Truck className="h-5 w-5" />
        Delivery #{delivery.id}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Meal Time: {delivery.mealTime}</span>
          <span className={`px-2 py-1 rounded-full text-sm ${
            delivery.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
            delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {delivery.status}
          </span>
        </div>
        <div className="mt-4">
          <select 
            className="border rounded p-1"
            value={delivery.status}
            onChange={(e) => onStatusUpdate(delivery.id, e.target.value)}
          >
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
);