import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardList,
  Users,
  TruckIcon,
  Calendar,
  PlusCircle,
  FileText,
} from "lucide-react";
import { AddPatientForm } from "./addPatientform";

// Type definitions
interface DashboardStats {
  totalActivePatients: number;
  todayDeliveries: number;
  pendingDeliveries: number;
  dietPlansToday: number;
  mealStatus: {
    pending: number;
    preparing: number;
    delivered: number;
  };
}

interface Patient {
  _id: string;
  name: string;
  roomNumber: string;
  status: "active" | "inactive";
  dietaryRestrictions: string[];
}

interface DeliveryTrend {
  name: string;
  deliveries: number;
}

interface PatientListProps {
  onSelectPatient: (patientId: string) => void;
}

// Patient List Component
const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients");
        const data = await response.json();
        if (data.success) {
          setPatients(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div
          key={patient._id}
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
          onClick={() => onSelectPatient(patient._id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{patient.name}</h3>
              <p className="text-sm text-gray-500">
                Room: {patient.roomNumber}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Diet Plan
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ManagerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalActivePatients: 0,
    todayDeliveries: 0,
    pendingDeliveries: 0,
    dietPlansToday: 0,
    mealStatus: {
      pending: 0,
      preparing: 0,
      delivered: 0,
    },
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [showAddPatient, setShowAddPatient] = useState(false);

  const deliveryTrend: DeliveryTrend[] = [
    { name: "6AM", deliveries: 4 },
    { name: "9AM", deliveries: 8 },
    { name: "12PM", deliveries: 15 },
    { name: "3PM", deliveries: 12 },
    { name: "6PM", deliveries: 18 },
    { name: "9PM", deliveries: 7 },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 300000);

    return () => clearInterval(interval);
  }, []);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    // Navigate to patient diet plan view or open modal
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <AddPatientForm onClose={() => setShowAddPatient(false)} />
            </DialogContent>
          </Dialog>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Patients
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.totalActivePatients}
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
                  Today's Deliveries
                </p>
                <h3 className="text-2xl font-bold">{stats.todayDeliveries}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Deliveries
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.pendingDeliveries}
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
                  Diet Plans Today
                </p>
                <h3 className="text-2xl font-bold">{stats.dietPlansToday}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* Meal Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.mealStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium capitalize">
                      {status}
                    </span>
                    <div className="flex items-center">
                      <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
                        <div
                          className={`h-full rounded-full ${
                            status === "pending"
                              ? "bg-yellow-400"
                              : status === "preparing"
                              ? "bg-blue-400"
                              : "bg-green-400"
                          }`}
                          style={{
                            width: `${
                              (count /
                                (stats.mealStatus.pending +
                                  stats.mealStatus.preparing +
                                  stats.mealStatus.delivered)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientList onSelectPatient={handlePatientSelect} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
