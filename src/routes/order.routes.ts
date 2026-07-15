import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

router.get('/', adminOnly, orderController.getAllOrders);
router.put('/:id/status', adminOnly, orderController.updateOrderStatus);

export default router;
