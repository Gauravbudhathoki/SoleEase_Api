import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', protect, adminOnly, productController.createProduct);
router.put('/:id', protect, adminOnly, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

export default router;
