import express from 'express';
import { 
    createProduct, getAllProducts, getProductById, 
    updateProduct, deleteProduct, usersWithProducts, productCountByCategory 
} from '../controllers/productController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for product management
router.post('/', authenticateUser, createProduct);
router.get('/', authenticateUser, getAllProducts);
router.get('/:id', authenticateUser, getProductById);
router.put('/:id', authenticateUser, updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

// Routes for analytics
router.get('/analytics/users', authenticateUser, usersWithProducts);
router.get('/analytics/category', authenticateUser, productCountByCategory);

export default router;
