// pages/pantry-dashboard.tsx
import { useState, useEffect } from "react";
import { ChefHat, Truck, ClipboardList } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { StatsCard } from "../components/stats-card";
import MealPreparationCard from "../components/meal-preparation-card";
import { DeliveryCard } from "../components/delivery-card";
import type {
  IMeal,
  IDelivery,
  IPantryStats,
  StatusUpdateFn,
} from "../types/random";

const PantryDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("preparations");
  const [preparations, setPreparations] = useState<IMeal[]>([]);
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [stats, setStats] = useState<IPantryStats>({
    totalPreparations: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
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

        const meals = await mealsResponse.json();
        const deliveries = await deliveriesResponse.json();

        setPreparations(meals);
        setDeliveries(deliveries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        //, deliveriesResponse, statsResponse
        const [mealsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/pantry/preparations`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("/api/deliveries"),
          fetch("/api/pantry-stats"),
        ]);

        const meals = await mealsResponse.json();
        console.log("meals", meals);
        //const deliveries = await deliveriesResponse.json();
        //const stats = await statsResponse.json();

        setPreparations(meals);
        // setDeliveries(deliveries);
        setStats({
          totalPreparations: 0,
          activeDeliveries: 0,
          completedDeliveries: 0,
        }); //change
      } catch (error) {
        console.error("Error fetching data:", error);
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
  // const handleAssignDelivery = async (
  //   deliveryId: string,
  //   personnelId: string
  // ) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("/api/deliveries/assign", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ deliveryId, personnelId }),
  //     });

  //     if (!response.ok) throw new Error("Failed to assign delivery");

  //     const updatedDelivery = await response.json();
  //     setDeliveries((prev) =>
  //       prev.map((delivery) =>
  //         delivery.id === deliveryId ? updatedDelivery : delivery
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error assigning delivery:", error);
  //   }
  // };

  // const handleMealStatusUpdate: StatusUpdateFn = async (id, status) => {
  //   try {
  //     const response = await fetch(`/api/pantry/preparations/${id}/${mealtime}/status`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update status");

  //     setPreparations((prev) =>
  //       prev.map((meal) =>
  //         meal._id === id ? { ...meal, status: status as IMeal["status"] } : meal
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating meal status:", error);
  //   }
  // };

  // const handleDeliveryStatusUpdate: StatusUpdateFn = async (id, status) => {
  //   try {
  //     const response = await fetch(`/api/deliveries/${id}/status`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update status");

  //     setDeliveries((prev) =>
  //       prev.map((delivery) =>
  //         delivery.id === id
  //           ? { ...delivery, status: status as IDelivery["status"] }
  //           : delivery
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating delivery status:", error);
  //   }
  // };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Pantry Dashboard</h1>
      </header>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="preparations" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Meal Preparations
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preparations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preparations.map((meal) => (
              <MealPreparationCard
                key={meal._id}
                meal={meal}
                className="mb-4"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map((delivery) => (
              <DeliveryCard
                key={delivery._id.toString()}
                delivery={delivery}
                onStatusUpdate={handleDeliveryStatusUpdate}
                className="mb-4"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="stats"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <StatsCard
            title="Today's Preparations"
            value={stats.totalPreparations}
          />
          <StatsCard title="Active Deliveries" value={stats.activeDeliveries} />
          <StatsCard
            title="Completed Today"
            value={stats.completedDeliveries}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PantryDashboard;
