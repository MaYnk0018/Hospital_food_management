import { useState, useEffect } from "react";
import { ChefHat, Truck, ClipboardList, Loader2 } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { StatsCard } from "../components/stats-card";
import MealPreparationCard from "../components/meal-preparation-card";
import { DeliveryCard } from "../components/delivery-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import type { IMeal, IDelivery, IPantryStats, StatusUpdateFn } from "../types/random";

const PantryDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("preparations");
  const [preparations, setPreparations] = useState<IMeal[]>([]);
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [stats, setStats] = useState<IPantryStats>({
    totalPreparations: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const [mealsResponse, deliveriesResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/pantry/preparations`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/pantry/deliveries`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!mealsResponse.ok || !deliveriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const meals = await mealsResponse.json();
        const deliveries = await deliveriesResponse.json();

        setPreparations(meals);
        setDeliveries(deliveries);
        setStats({
          totalPreparations: meals.length,
          activeDeliveries: deliveries.filter(d => d.status === 'active').length,
          completedDeliveries: deliveries.filter(d => d.status === 'completed').length,
        });
      } catch (error) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeliveryStatusUpdate: StatusUpdateFn = async (
    id: string,
    status: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pantry/deliveries/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedDelivery = await response.json();
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery._id.toString() === id ? updatedDelivery : delivery
        )
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pantry Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage meal preparations and deliveries
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex gap-3">
                <StatsCard
                  title="Today's Preparations"
                  value={stats.totalPreparations}
                  className="bg-blue-50"
                />
                <StatsCard
                  title="Active Deliveries"
                  value={stats.activeDeliveries}
                  className="bg-green-50"
                />
                <StatsCard
                  title="Completed Today"
                  value={stats.completedDeliveries}
                  className="bg-purple-50"
                />
              </div>
            </div>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white shadow-sm">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="preparations"
                className="flex items-center gap-4 mr-4 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <ChefHat className="h-4 w-4" />
                Meal Preparations
              </TabsTrigger>
              <TabsTrigger
                value="deliveries"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Truck className="h-4 w-4" />
                Deliveries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preparations" className="space-y-4">
              {preparations.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No preparations</h3>
                  <p className="mt-1 text-sm text-gray-500">No meal preparations scheduled for today.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {preparations.map((meal) => (
                    <MealPreparationCard
                      key={meal._id}
                      meal={meal}
                      className="transition-all hover:shadow-md"
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deliveries" className="space-y-4">
              {deliveries.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No deliveries</h3>
                  <p className="mt-1 text-sm text-gray-500">No active deliveries at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deliveries.map((delivery) => (
                    <DeliveryCard
                      key={delivery._id.toString()}
                      delivery={delivery}
                      onStatusUpdate={handleDeliveryStatusUpdate}
                      className="transition-all hover:shadow-md"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PantryDashboard;