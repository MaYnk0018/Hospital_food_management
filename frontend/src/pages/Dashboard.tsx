import React, { useState } from 'react';
import { 
  Plus, X, Edit, AlertCircle, Calendar, Trash2, 
  UserCheck, ClipboardList, ChefHat 
} from 'lucide-react';

// Types
interface MealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

interface Meal {
  items: MealItem[];
  status: "pending" | "preparing" | "delivered";
}

interface Patient {
  id: string;
  name: string;
  diseases: string[];
  allergies: string[];
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  age: number;
  gender: string;
  contactInfo: string;
  emergencyContact: {
    name: string;
    relation: string;
    contact: string;
  };
  status: 'active' | 'discharged';
}

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Diet Plan Form Component
const DietPlanForm: React.FC<{
  patient: Patient;
  onSubmit: (data: any) => void;
}> = ({ patient, onSubmit }) => {
  const mealTimes = ['morning', 'evening', 'night'];
  const [selectedMeal, setSelectedMeal] = useState(mealTimes[0]);

  return (
    <form className="space-y-4">
      <div className="flex gap-4 mb-4">
        {mealTimes.map(meal => (
          <button
            key={meal}
            type="button"
            className={`px-4 py-2 rounded-lg ${
              selectedMeal === meal 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setSelectedMeal(meal)}
          >
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meal Items
          </label>
          <div className="space-y-2">
            {['Main Course', 'Side Dish', 'Dessert'].map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={item}
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Special Instructions"
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dietary Restrictions
          </label>
          <div className="flex gap-2 flex-wrap">
            {patient.allergies.map((allergy, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Save Diet Plan
        </button>
      </div>
    </form>
  );
};

// Patient List with Actions
const PatientList: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDietModal, setShowDietModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Mock data - replace with API calls
  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      diseases: ['Diabetes'],
      allergies: ['Nuts', 'Dairy'],
      roomNumber: '201',
      bedNumber: 'A',
      floorNumber: '2',
      age: 45,
      gender: 'Male',
      contactInfo: '123-456-7890',
      emergencyContact: {
        name: 'Jane Doe',
        relation: 'Spouse',
        contact: '098-765-4321'
      },
      status: 'active'
    },
    // Add more mock patients...
  ];

  const handleDietPlanSubmit = (data: any) => {
    console.log('Diet plan submitted:', data);
    setShowDietModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-gray-900 dark:text-white">
          Patient Management
        </h1>
        <button
          onClick={() => setShowPatientModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b dark:border-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {patient.diseases.join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      Room {patient.roomNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Bed {patient.bedNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      patient.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowDietModal(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Manage Diet Plan"
                      >
                        <ClipboardList className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        title="Edit Patient"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Discharge Patient"
                      >
                        <UserCheck className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diet Plan Modal */}
      <Modal
        isOpen={showDietModal}
        onClose={() => setShowDietModal(false)}
        title={`Diet Plan - ${selectedPatient?.name}`}
      >
        {selectedPatient && (
          <DietPlanForm
            patient={selectedPatient}
            onSubmit={handleDietPlanSubmit}
          />
        )}
      </Modal>

      {/* Add/Edit Patient Modal would go here */}
    </div>
  );
};

export default PatientList;