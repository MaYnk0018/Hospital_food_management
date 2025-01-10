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
import '../../style.css'
import { IDelivery, IDiet, IPatient } from "../types/random";
import { AddPatientForm } from "../components/addPatientform";
import { AddDietForm } from "../components/addDietform";
import { PatientDietView } from "../components/patientDietview";
import { DeliveryStatus } from "../components/deliveryStatus";

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

      if (statsData.success) setStats(statsData.data);
      if (patientsData.patients) {
        setPatients(patientsData.patients);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/diets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...dietData,
            patientId: selectedPatient._id.toString(),
            date: new Date().toISOString(),
          }),
        }
      );

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
          },
          {
            _id: mostRecentDiet.meals.evening._id,
            mealTime: "evening",
            dietId: mostRecentDiet._id,
            status: mostRecentDiet.meals.evening.status,
          },
          {
            _id: mostRecentDiet.meals.night._id,
            mealTime: "night",
            dietId: mostRecentDiet._id,
            status: mostRecentDiet.meals.night.status,
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
      <div className="flex items-center justify-between mb-6">
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

      {/* Stats Section - Currently commented out but kept for reference */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ... (stats cards code remains the same)
      </div> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Patient List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Active Patients</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto h-[calc(100vh-300px)] hide-scrollbar">
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
        <Card className="lg:col-span-2 overflow-hidden">
          {selectedPatient && selectedDiet ? (
            <div className="h-full flex flex-col">
              <CardHeader className="border-b p-0">
                <Tabs defaultValue="diet" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="diet" className="w-full">
                      Diet Plan
                    </TabsTrigger>
                    <TabsTrigger value="delivery" className="w-full">
                      Delivery Status
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6 overflow-y-auto h-[calc(100vh-300px)] hide-scrollbar">
                    <TabsContent value="diet" className="mt-0 h-full">
                      <PatientDietView
                        patient={selectedPatient}
                        diet={selectedDiet}
                      />
                    </TabsContent>

                    <TabsContent value="delivery" className="mt-0 h-full">
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
                            console.error(
                              "Failed to update delivery status:",
                              error
                            );
                          }
                        }}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardHeader>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-[calc(100vh-300px)]">
              <p className="text-gray-500">
                Select a patient to view their diet plan and delivery status
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;