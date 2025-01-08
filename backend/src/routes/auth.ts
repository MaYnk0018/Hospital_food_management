import express from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;