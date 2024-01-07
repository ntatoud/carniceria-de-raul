import { Router, urlencoded, Request, Response } from 'express';
import products from './products.js';
import users from './users.js';
import orders from './orders.js';
import { adminOnlyRoute } from '@/router/guard/admin.js';
const router = Router();

router.use(urlencoded({ extended: true }));

router.use('/orders', adminOnlyRoute, orders);
router.use('/users', adminOnlyRoute, users);
router.use('/products', adminOnlyRoute, products);
router.use('/', adminOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/admin/users');
});

export default router;
