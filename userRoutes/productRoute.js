import express from 'express';
import { 
    createProduct, getAllProducts, getProductById, 
    updateProduct, deleteProduct, usersWithProducts, productCountByCategory 
} from '../controllers/productController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploads.js';
import { productValidator } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/authMiddleware.js';
import { exportProductsCSV } from '../controllers/productController.js';

// Product routes for handling all the product-related operations
const router = express.Router();

router.post('/', authenticateUser, upload.single('image'), productValidator, validate, createProduct);

router.get('/download-csv', authenticateUser, isAdmin, exportProductsCSV);
router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', authenticateUser, upload.single('image'), productValidator, validate, updateProduct);

router.delete('/:id', authenticateUser, deleteProduct);

router.get('/analytics/users', authenticateUser, usersWithProducts);
router.get('/analytics/category', authenticateUser, productCountByCategory);

export default router;


