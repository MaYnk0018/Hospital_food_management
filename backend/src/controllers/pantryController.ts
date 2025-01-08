import { Request, Response } from 'express';
import { Diet } from '../models/Diet';
import { Delivery } from '../models/Delivery';
import { User } from '../models/User';
import { logger } from '../utils/Logger';

export class PantryController {
  async getAllMealPreparations(req: Request, res: Response) {
    const preparations = await Diet.find()
      .populate('patientId', 'name roomNumber bedNumber')
      .select('meals date');
    logger.info('Fetched all meal preparations');
    return preparations;
  }

  async getMealPreparationById(req: Request<{ dietId: string }>, res: Response) {
    const preparation = await Diet.findById(req.params.dietId).populate('patientId');

    if (!preparation) {
      logger.error('Meal preparation not found', { dietId: req.params.dietId });
      return res.status(404).json({ message: 'Meal preparation not found' });
    }

    logger.info('Fetched meal preparation by ID', { dietId: req.params.dietId });
    return preparation;
  }

  async updateMealStatus(
    req: Request<{ dietId: string; mealTime: 'morning' | 'evening' | 'night' }>,
    res: Response
  ) {
    const { dietId, mealTime } = req.params;
    const { status } = req.body;

    const updatePath = `meals.${mealTime}.status`;
    const updatedDiet = await Diet.findByIdAndUpdate(
      dietId,
      { [updatePath]: status },
      { new: true }
    );

    if (!updatedDiet) {
      logger.error('Diet not found', { dietId });
      return res.status(404).json({ message: 'Diet not found' });
    }

    logger.info('Updated meal status', { dietId, mealTime, status });
    return updatedDiet;
  }

  async assignDelivery(req: Request, res: Response) {
    const { dietId, deliveryPersonnelId, mealTime } = req.body;

    const deliveryPerson = await User.findById(deliveryPersonnelId);
    if (!deliveryPerson) {
      logger.error('Delivery personnel not found', { deliveryPersonnelId });
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }

    const delivery = await Delivery.create({
      dietId,
      assignedTo: deliveryPersonnelId,
      mealTime,
      status: 'assigned',
    });

    logger.info('Assigned delivery', { dietId, deliveryPersonnelId, mealTime });
    return delivery;
  }

  async getAllDeliveries(req: Request, res: Response) {
    const deliveries = await Delivery.find()
      .populate('dietId')
      .populate('assignedTo', 'name phoneNumber');
    logger.info('Fetched all deliveries');
    return deliveries;
  }

  async updateDeliveryStatus(req: Request<{ id: string }>, res: Response) {
    const { status, notes } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        ...(status === 'delivered' && { deliveredAt: new Date() }),
      },
      { new: true }
    );

    if (!delivery) {
      logger.error('Delivery not found', { id: req.params.id });
      return res.status(404).json({ message: 'Delivery not found' });
    }

    logger.info('Updated delivery status', { id: req.params.id, status, notes });
    return delivery;
  }

  async getPantryStats(req: Request, res: Response) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPreparations,
      pendingPreparations,
      completedDeliveries,
      activeDeliveries,
    ] = await Promise.all([
      Diet.countDocuments({ date: today }),
      Diet.countDocuments({
        date: today,
        $or: [
          { 'meals.morning.status': 'pending' },
          { 'meals.evening.status': 'pending' },
          { 'meals.night.status': 'pending' },
        ],
      }),
      Delivery.countDocuments({
        status: 'delivered',
        deliveredAt: { $gte: today },
      }),
      Delivery.countDocuments({
        status: { $in: ['assigned', 'in-progress'] },
      }),
    ]);

    logger.info('Fetched pantry stats', {
      totalPreparations,
      pendingPreparations,
      completedDeliveries,
      activeDeliveries,
    });

    return {
      totalPreparations,
      pendingPreparations,
      completedDeliveries,
      activeDeliveries,
      efficiency: totalPreparations
        ? (completedDeliveries / totalPreparations) * 100
        : 0,
    };
  }

  async getPantryStaff(req: Request, res: Response) {
    const staff = await User.find({ role: 'pantry_staff' }).select(
      'name phoneNumber status currentTask'
    );
    logger.info('Fetched pantry staff');
    return staff;
  }

  async assignStaffToTask(req: Request, res: Response) {
    const { staffId, taskType, dietId } = req.body;

    const staff = await User.findByIdAndUpdate(
      staffId,
      {
        currentTask: {
          type: taskType,
          dietId,
          assignedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!staff) {
      logger.error('Staff member not found', { staffId });
      return res.status(404).json({ message: 'Staff member not found' });
    }

    logger.info('Assigned staff to task', { staffId, taskType, dietId });
    return staff;
  }
}
