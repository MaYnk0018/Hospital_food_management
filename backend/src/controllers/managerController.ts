// src/controllers/managerController.ts
import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { Diet } from '../models/Diet';
import { Delivery } from '../models/Delivery';
import { User } from '../models/User';
import { Types } from 'mongoose';

export class ManagerController {
  // Patient Management
  async createPatient(req: Request, res: Response) {
    try {
      const patient = await Patient.create(req.body);
      return res.status(201).json(patient);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create patient' });
    }
  }

  async updatePatient(req: Request, res: Response) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.status(200).json(patient);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update patient' });
    }
  }

  async getPatient(req: Request, res: Response) {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.status(200).json(patient);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get patient' });
    }
  }

  async getAllPatients() {
    try {
      const patients = await Patient.find({ status: 'active' });
      return patients;
    } catch (error) {
      throw error; // Let the router's error handler handle it
    }
  }

  // Diet Management
  async createDiet(req: Request, res: Response) {
    try {
      const { patientId, date, meals } = req.body;
      const diet = await Diet.create({
        patientId,
        date: new Date(date),
        meals
      });
      return res.status(201).json(diet);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create diet plan' });
    }
  }

  async updateDiet(req: Request, res: Response) {
    try {
      const diet = await Diet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!diet) {
        return res.status(404).json({ error: 'Diet plan not found' });
      }
      return res.status(200).json(diet);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update diet plan' });
    }
  }

  async getDietsByPatient(req: Request, res: Response) {
    console.log("patientId",req.params.patientId)
    try {
      const diets = await Diet.find({ patientId: req.params.patientId })
        .sort({ date: -1 });
      return res.status(200).json(diets);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get diet plans' });
    }
  }

  // Delivery Management
  async assignDelivery(req: Request, res: Response) {
    try {
      const { dietId, assignedTo, mealTime } = req.body;
      const delivery = await Delivery.create({
        dietId,
        assignedTo,
        mealTime,
        status: 'assigned'
      });
      return res.status(201).json(delivery);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to assign delivery' });
    }
  }

  async getDeliveryStatus(req: Request, res: Response) {
    try {
      const deliveries = await Delivery.find()
        .populate('dietId')
        .populate('assignedTo')
        .sort({ deliveredAt: -1 });
      return res.status(200).json(deliveries);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get delivery status' });
    }
  }

  // Dashboard Analytics
  async getDashboardStats(req: Request, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = {
        totalActivePatients: await Patient.countDocuments({ status: 'active' }),
        todayDeliveries: await Delivery.countDocuments({
          deliveredAt: { $gte: today }
        }),
        pendingDeliveries: await Delivery.countDocuments({
          status: { $ne: 'delivered' }
        }),
        dietPlansToday: await Diet.countDocuments({
          date: { $gte: today }
        })
      };

      return res.status(200).json(stats);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to get dashboard stats' });
    }
  }
}
