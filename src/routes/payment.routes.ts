import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/payment.controller';

const router = Router();

router.use(protect);

router.post('/esewa/initiate', initiateEsewaPayment);
router.post('/esewa/verify', verifyEsewaPayment);

export default router;
