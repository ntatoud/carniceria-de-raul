import { Router, urlencoded, Request, Response } from 'express';
import products from './products';
import users from './users';
import orders from './orders';
import { adminOnlyRoute } from '../../middlewares/admin';
const router = Router();

router.use(urlencoded({ extended: true }));

router.use('/orders', adminOnlyRoute, orders);
router.use('/users', adminOnlyRoute, users);
router.use('/products', adminOnlyRoute, products);
router.use('/', adminOnlyRoute, (req: Request, res: Response) => {
    res.redirect('/admin/users');
});

export default router;
