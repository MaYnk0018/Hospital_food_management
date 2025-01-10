import { Truck, User, MapPin, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { DeliveryCardProps } from "../types/random";

export const DeliveryCard = ({
  delivery,
  onStatusUpdate,
  className
}: DeliveryCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Truck className="h-5 w-5" />
        Delivery #{delivery._id.toString().slice(-6)}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Status Section */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Meal Time: {delivery.mealTime}</span>
          <span className={`px-2 py-1 rounded-full text-sm ${
            delivery.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
            delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {delivery.status}
          </span>
        </div>

        {/* Delivery Person Details */}
        <div className="border-t pt-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            Delivery Person
          </h3>
          <div className="ml-6 space-y-1">
            <p className="text-sm">{delivery?.assignedTo?.name}</p>
            <p className="text-sm text-gray-600">{delivery.assignedTo?.email}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {delivery.assignedTo?.contact}
            </p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="border-t pt-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" />
            Delivery Location
          </h3>
          <div className="ml-6 space-y-1">
            <p className="text-sm">Patient: {delivery.dietId?.patientId.name}</p>
            <p className="text-sm text-gray-600">
              Room {delivery.dietId?.patientId.roomNumber}, 
              Bed {delivery.dietId?.patientId.bedNumber}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="border-t pt-3">
          <label className="text-sm font-semibold block mb-2">Update Status:</label>
          <select
            className="w-full border rounded p-2"
            value={delivery.status}
            onChange={(e) => onStatusUpdate(delivery._id.toString(), e.target.value)}
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