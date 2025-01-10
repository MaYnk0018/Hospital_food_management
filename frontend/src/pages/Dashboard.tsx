//React
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Users,
  ChefHat,
  TruckIcon,
  Calendar,
  PlusCircle,
  FileText,
} from "lucide-react";
//ClipboardList,
import {
 
  IDelivery,
  IDiet,
  IPatient,
} from "../types/random";
// IMealItem,
// MealTimeStatus,
// MealTime,IMeals,
import { AddPatientForm } from "../components/addPatientform";
import { AddDietForm } from "../components/addDietform";
import { PatientDietView } from "../components/patientDietview";
import { DeliveryStatus } from "../components/deliveryStatus";
//import { IPatient, IDiet, IDelivery, IMeal } from "../types/dashboard";

interface DashboardStats {
  totalPatients: number;
  mealsToday: {
    morning: number;
    evening: number;
    night: number;
  };
  deliveryStatus: {
    pending: number;
    inProgress: number;
    delivered: number;
  };
  pantryStatus: {
    preparing: number;
    ready: number;
  };
}

// const isValidId = (id: any): id is string => {
//   return (
//     typeof id === "string" ||
//     (typeof id === "object" && id !== null && "_id" in id)
//   );
// };
const ManagerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    mealsToday: { morning: 0, evening: 0, night: 0 },
    deliveryStatus: { pending: 0, inProgress: 0, delivered: 0 },
    pantryStatus: { preparing: 0, ready: 0 },
  });

  const [patients, setPatients] = useState<IPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<IDiet | null>(null);
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddDiet, setShowAddDiet] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [statsRes, patientsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/manager/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/manager/patients`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!statsRes.ok || !patientsRes.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const statsData = await statsRes.json();
      const patientsData = await patientsRes.json();

      console.log("Received patient data:", patientsData.patients); // Log the incoming data

      if (statsData.success) setStats(statsData.data);
      if (patientsData.patients) {
        setPatients(patientsData.patients);
        console.log("Setting patients with:", patientsData.patients); // Log what we're setting
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    console.log("Patients state updated:", patients);
  }, [patients]);
  const handleAddPatient = async (patientData: Omit<IPatient, "_id">) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Failed Load token");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/patients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(patientData),
        }
      );

      if (response.ok) {
        setShowAddPatient(false);
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  const handleAddDiet = async (dietData: Omit<IDiet, "_id">) => {
    if (!selectedPatient?._id) {
      console.log("no patient id selected");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // Add token for authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/diets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add authorization header
        },
        body: JSON.stringify({
          ...dietData,
          patientId: selectedPatient._id.toString(),
          date: new Date().toISOString(), // Add date if not included in dietData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add diet:", errorData);
        return;
      }

      const data = await response.json();
      if (data) {
        setShowAddDiet(false);
        fetchPatientDiet(selectedPatient._id.toString());
      }
    } catch (error) {
      console.error("Failed to add diet:", error);
    }
  };

  const fetchPatientDiet = async (patientId: string) => {
    try {
      const token = localStorage.getItem("token");
      console.log("patientId", patientId);

      const dietRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/patients/${patientId}/diets`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const diets = await dietRes.json();

      if (Array.isArray(diets) && diets.length > 0) {
        const mostRecentDiet = diets[0];

        const transformedDiet: IDiet = {
          _id: mostRecentDiet._id,
          meals: mostRecentDiet.meals,
          patientId: mostRecentDiet.patientId,
          date: mostRecentDiet.date,
        };

        setSelectedDiet(transformedDiet);

        const newDeliveries: IDelivery[] = [
          {
            _id: mostRecentDiet.meals.morning._id,
            mealTime: "morning",
            dietId: mostRecentDiet._id,
            status: mostRecentDiet.meals.morning.status,
            //items: mostRecentDiet.meals.morning.items,
          },
          {
            _id: mostRecentDiet.meals.evening._id,
            mealTime: "evening",
            dietId: mostRecentDiet._id,
            status: mostRecentDiet.meals.evening.status,
            //items: mostRecentDiet.meals.evening.items,
          },
          {
            _id: mostRecentDiet.meals.night._id,
            mealTime: "night",
            dietId: mostRecentDiet._id,
            status: mostRecentDiet.meals.night.status,
            //items: mostRecentDiet.meals.night.items,
          },
        ];

        setDeliveries(newDeliveries);
      } else {
        setSelectedDiet(null);
        setDeliveries([]);
      }
    } catch (error) {
      console.error("Failed to fetch patient diet:", error);
      setSelectedDiet(null);
      setDeliveries([]);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hospital Food Management</h1>
        <div className="flex space-x-4">
          <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <AddPatientForm
                onSubmit={handleAddPatient}
                onClose={() => setShowAddPatient(false)}
              />
            </DialogContent>
          </Dialog>

          {selectedPatient && (
            <Dialog open={showAddDiet} onOpenChange={setShowAddDiet}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Add Diet Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Diet Plan</DialogTitle>
                </DialogHeader>
                <div className="pr-2">
                  <AddDietForm
                    patientId={selectedPatient._id.toString()}
                    onSubmit={handleAddDiet}
                    onClose={() => setShowAddDiet(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Patients
                </p>
                <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  In Preparation
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.pantryStatus.preparing}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TruckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Deliveries Today
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.deliveryStatus.delivered}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Meals
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.deliveryStatus.pending}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient._id.toString()}
                  className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPatient(patient);
                    fetchPatientDiet(patient._id.toString());
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        Room: {patient.floorNumber}-{patient.roomNumber}-
                        {patient.bedNumber}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details and Diet View */}
        <div className="lg:col-span-2">
          {selectedPatient && selectedDiet ? (
            <Tabs defaultValue="diet" className="space-y-6">
              <TabsList>
                <TabsTrigger value="diet">Diet Plan</TabsTrigger>
                <TabsTrigger value="delivery">Delivery Status</TabsTrigger>
              </TabsList>

              <TabsContent value="diet">
                <PatientDietView
                  patient={selectedPatient}
                  diet={selectedDiet}
                />
              </TabsContent>

              <TabsContent value="delivery">
                <DeliveryStatus
                  deliveries={deliveries}
                  onUpdateStatus={async (_id, status) => {
                    const token = localStorage.getItem("token");
                    try {
                      await fetch(
                        `${import.meta.env.VITE_API_URL}/api/manager/deliveries`,
                        {
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ status }),
                        }
                      );
                      fetchPatientDiet(selectedPatient._id.toString());
                    } catch (error) {
                      console.error("Failed to update delivery status:", error);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Select a patient to view their diet plan and delivery status
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
