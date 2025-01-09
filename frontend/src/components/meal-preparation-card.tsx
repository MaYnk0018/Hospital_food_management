import { ChefHat } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MealPreparationCardProps } from "../types/pantry";

export const MealPreparationCard = ({ 
  meal, 
  onStatusUpdate, 
  className 
}: MealPreparationCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ChefHat className="h-5 w-5" />
        {meal.items[0]?.name || 'Unnamed Meal'}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Patient ID: {meal.patientId}</p>
        <div>
          <h4 className="font-medium">Ingredients:</h4>
          <ul className="list-disc pl-4">
            {meal.items[0]?.ingredients.map((ingredient, idx) => (
              <li key={idx} className="text-sm">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className={`px-2 py-1 rounded-full text-sm ${
            meal.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
            meal.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {meal.status}
          </span>
          <select 
            className="border rounded p-1"
            value={meal.status}
            onChange={(e) => onStatusUpdate(meal.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
);