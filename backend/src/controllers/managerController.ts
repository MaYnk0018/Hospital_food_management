import { Request, Response } from "express";
import { Patient, IPatient } from "../models/Patient";
import { Diet, IDiet } from "../models/Diet";
import { Delivery, IDelivery } from "../models/Delivery";
import { Types } from "mongoose";

// Request types for type safety
interface CreatePatientRequest extends Request {
  body: Omit<IPatient, "_id">;
}

interface UpdatePatientRequest extends Request {
  body: Partial<IPatient>;
  params: { id: string };
}

interface CreateDietRequest extends Request {
  body: {
    patientId: string;
    date: string;
    meals: {
      morning: {
        items: Array<{
          name: string;
          ingredients: string[];
          specialInstructions: string[];
        }>;
      };
      evening: {
        items: Array<{
          name: string;
          ingredients: string[];
          specialInstructions: string[];
        }>;
      };
      night: {
        items: Array<{
          name: string;
          ingredients: string[];
          specialInstructions: string[];
        }>;
      };
    };
  };
}

interface UpdateDietRequest extends Request {
  body: Partial<IDiet>;
  params: { id: string };
}

interface AssignDeliveryRequest extends Request {
  body: {
    dietId: string;
    assignedTo: string;
    mealTime: "morning" | "evening" | "night";
  };
}

export class ManagerController {
  // Patient Management
  async createPatient(req: CreatePatientRequest, res: Response) {
    try {
      const patientData = req.body;
      const patient = await Patient.create(patientData);
      return res.status(201).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to create patient",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updatePatient(req: UpdatePatientRequest, res: Response) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to update patient",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getPatient(req: Request<{ id: string }>, res: Response) {
    try {
      const patient = await Patient.findById(req.params.id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to get patient",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAllPatients(req: Request, res: Response) {
    try {
      const patients = await Patient.find({ status: "active" }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: patients.length,
        data: patients,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to get patients",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Diet Management
  async createDiet(req: CreateDietRequest, res: Response) {
    try {
      const { patientId, date, meals } = req.body;

      // Verify patient exists
      const patientExists = await Patient.exists({ _id: patientId });
      if (!patientExists) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      const diet = await Diet.create({
        patientId: new Types.ObjectId(patientId),
        date: new Date(date),
        meals: {
          morning: { ...meals.morning, status: "pending" },
          evening: { ...meals.evening, status: "pending" },
          night: { ...meals.night, status: "pending" },
        },
      });

      return res.status(201).json({
        success: true,
        data: diet,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to create diet plan",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateDiet(req: UpdateDietRequest, res: Response) {
    try {
      const diet = await Diet.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!diet) {
        return res.status(404).json({
          success: false,
          error: "Diet plan not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: diet,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to update diet plan",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getDietsByPatient(req: Request<{ patientId: string }>, res: Response) {
    try {
      const diets = await Diet.find({ patientId: req.params.patientId }).sort({
        date: -1,
      });

      return res.status(200).json({
        success: true,
        count: diets.length,
        data: diets,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to get diet plans",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delivery Management
  async assignDelivery(req: AssignDeliveryRequest, res: Response) {
    try {
      const { dietId, assignedTo, mealTime } = req.body;

      // Verify diet exists
      const dietExists = await Diet.exists({ _id: dietId });
      if (!dietExists) {
        return res.status(404).json({
          success: false,
          error: "Diet plan not found",
        });
      }

      const delivery = await Delivery.create({
        dietId: new Types.ObjectId(dietId),
        assignedTo: new Types.ObjectId(assignedTo),
        mealTime,
        status: "assigned",
      });

      // Update diet meal status
      await Diet.findByIdAndUpdate(dietId, {
        $set: { [`meals.${mealTime}.status`]: "preparing" },
      });

      return res.status(201).json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to assign delivery",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getDeliveryStatus(req: Request, res: Response) {
    try {
      const deliveries = await Delivery.find()
        .populate("dietId")
        .populate("assignedTo", "name contact")
        .sort({ deliveredAt: -1 });

      return res.status(200).json({
        success: true,
        count: deliveries.length,
        data: deliveries,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to get delivery status",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Dashboard Analytics
  async getDashboardStats(req: Request, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalActivePatients,
        todayDeliveries,
        pendingDeliveries,
        dietPlansToday,
        mealsByStatus,
      ] = await Promise.all([
        Patient.countDocuments({ status: "active" }),
        Delivery.countDocuments({ deliveredAt: { $gte: today } }),
        Delivery.countDocuments({ status: { $ne: "delivered" } }),
        Diet.countDocuments({ date: { $gte: today } }),
        Diet.aggregate([
          { $match: { date: { $gte: today } } },
          {
            $group: {
              _id: null,
              pending: {
                $sum: {
                  $size: {
                    $filter: {
                      input: [
                        "$meals.morning.status",
                        "$meals.evening.status",
                        "$meals.night.status",
                      ],
                      cond: { $eq: ["$$this", "pending"] },
                    },
                  },
                },
              },
              preparing: {
                $sum: {
                  $size: {
                    $filter: {
                      input: [
                        "$meals.morning.status",
                        "$meals.evening.status",
                        "$meals.night.status",
                      ],
                      cond: { $eq: ["$$this", "preparing"] },
                    },
                  },
                },
              },
              delivered: {
                $sum: {
                  $size: {
                    $filter: {
                      input: [
                        "$meals.morning.status",
                        "$meals.evening.status",
                        "$meals.night.status",
                      ],
                      cond: { $eq: ["$$this", "delivered"] },
                    },
                  },
                },
              },
            },
          },
        ]),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          totalActivePatients,
          todayDeliveries,
          pendingDeliveries,
          dietPlansToday,
          mealStatus: mealsByStatus[0] || {
            pending: 0,
            preparing: 0,
            delivered: 0,
          },
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Failed to get dashboard stats",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
