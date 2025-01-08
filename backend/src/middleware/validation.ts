// src/middleware/validation.ts
import { body } from 'express-validator';

export const validateSignup = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('role')
    .isIn(['manager', 'pantry', 'delivery'])
    .withMessage('Invalid role selected'),
  
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please enter a valid contact number')
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];