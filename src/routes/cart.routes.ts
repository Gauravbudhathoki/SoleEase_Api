import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.put('/update', cartController.updateItemQuantity);
router.delete('/remove', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

export default router;
