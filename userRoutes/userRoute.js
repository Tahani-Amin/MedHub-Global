// User routes for handling user registration and login

import express from 'express';

import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';
import { registerValidator, validate } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.post('/register', registerValidator, validate, registerUser);
router.get('/', authenticateUser, isAdmin, getAllUsers);


export default router;
