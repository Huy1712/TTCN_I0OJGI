import { Router } from 'express';
import { createOrder, getCheckoutQuote } from '../controllers/order.controller';

const router = Router();

router.post('/quote', getCheckoutQuote);
router.post('/', createOrder);

export default router;
