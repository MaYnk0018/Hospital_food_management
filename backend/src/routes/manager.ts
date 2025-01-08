import { Router, Request, Response, NextFunction } from 'express';
import { ManagerController } from '../controllers/managerController';
import { authMiddleware } from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

// Define interfaces for type safety
interface Patient {
  id: string;
  name: string;
  age: number;
  // Add other patient properties
}

interface Diet {
  id: string;
  patientId: string;
  type: string;
  // Add other diet properties
}

interface Delivery {
  id: string;
  status: string;
  // Add other delivery properties
}

const router = Router();
const controller = new ManagerController();


// Authentication middleware
router.use(authMiddleware);
router.use(roleMiddleware(['manager']));

// Patient routes
router.post('/patients', asyncHandler(async (req: Request, res: Response) => {
  const patient = await controller.createPatient(req, res);
  res.status(201).json(patient); //added json for testing ..
}));

router.put('/patients/:id', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const patient = await controller.updatePatient(req, res);
  res.json(patient);
}));

router.get('/patients/:id', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const patient = await controller.getPatient(req, res);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
}));

router.get('/patients', asyncHandler(async (req: Request, res: Response) => {
  const patients = await controller.getAllPatients(req, res);
  res.json(patients);
}));

// Diet routes
router.post('/diets', asyncHandler(async (req: Request, res: Response) => {
  const diet = await controller.createDiet(req, res);
  res.status(201).json(diet);
}));

router.put('/diets/:id', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const diet = await controller.updateDiet(req, res);
  if (!diet) {
    return res.status(404).json({ message: 'Diet not found' });
  }
  res.json(diet);
}));

router.get('/patients/:patientId/diets', asyncHandler(async (req: Request<{ patientId: string }>, res: Response) => {
  const diets = await controller.getDietsByPatient(req, res);
  res.json(diets);
}));

// Delivery routes
router.post('/deliveries', asyncHandler(async (req: Request, res: Response) => {
  const delivery = await controller.assignDelivery(req, res);
  res.status(201).json(delivery);
}));

router.get('/deliveries', asyncHandler(async (req: Request, res: Response) => {
  const deliveries = await controller.getDeliveryStatus(req, res);
  res.json(deliveries);
}));

// Dashboard routes
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const stats = await controller.getDashboardStats(req, res);
  res.json(stats);
}));

export default router;