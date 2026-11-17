import { Router } from 'express';
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
  updateProfile,
} from '../controllers/account.controller';

const router = Router();

router.patch('/profile', updateProfile);
router.get('/addresses', listAddresses);
router.post('/addresses', createAddress);
router.patch('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

export default router;
