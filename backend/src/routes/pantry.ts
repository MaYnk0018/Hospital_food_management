import { Router, Request, Response } from 'express';
import { PantryController } from '../controllers/pantryController';
import { authMiddleware } from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

// Interfaces for type safety
interface MealItem {
  name: string;
  ingredients: string[];
  specialInstructions: string[];
}

interface Meal {
  items: MealItem[];
  status: 'pending' | 'preparing' | 'delivered';
}

interface Diet {
  patientId: string;
  date: Date;
  meals: {
    morning: Meal;
    evening: Meal;
    night: Meal;
  };
}

interface Delivery {
  dietId: string;
  assignedTo?: string;
  mealTime: 'morning' | 'evening' | 'night';
  status: 'assigned' | 'in-progress' | 'delivered';
  deliveredAt?: Date;
  notes?: string;
}

const router = Router();
const controller = new PantryController();

// Authentication middleware
router.use(authMiddleware);
router.use(roleMiddleware(['pantry']));

// Meal preparation routes
router.get('/preparations', asyncHandler(async (req: Request, res: Response) => {
  const preparations = await controller.getAllMealPreparations(req, res);
  res.json(preparations);
}));

router.get('/preparations/:dietId', asyncHandler(async (req: Request<{ dietId: string }>, res: Response) => {
  const preparation = await controller.getMealPreparationById(req, res);
  if (!preparation) {
    return res.status(404).json({ message: 'Meal preparation not found' });
  }
  res.json(preparation);
}));

router.put(
  '/preparations/:dietId/:mealTime/status',
  asyncHandler(async (req: Request<{ dietId: string; mealTime: 'morning' | 'evening' | 'night' }>, res: Response) => {
    const updatedMeal = await controller.updateMealStatus(req, res);
    if (!updatedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(updatedMeal);
  })
);

// Delivery routes
router.post('/deliveries/assign', asyncHandler(async (req: Request, res: Response) => {
  const delivery = await controller.assignDelivery(req, res);
  res.status(201).json(delivery);
}));

router.get('/deliveries', asyncHandler(async (req: Request, res: Response) => {
  const deliveries = await controller.getAllDeliveries(req, res);
  res.json(deliveries);
}));

router.put(
  '/deliveries/:id/status',
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const delivery = await controller.updateDeliveryStatus(req, res);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json(delivery);
  })
);

// Dashboard routes
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const stats = await controller.getPantryStats(req, res);
  res.json(stats);
}));

// Staff management routes
router.get('/staff', asyncHandler(async (req: Request, res: Response) => {
  const staff = await controller.getPantryStaff(req, res);
  res.json(staff);
}));

router.post('/staff/assign', asyncHandler(async (req: Request, res: Response) => {
  const assignment = await controller.assignStaffToTask(req, res);
  res.status(201).json(assignment);
}));

export default router;