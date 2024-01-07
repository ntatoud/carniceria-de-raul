import { Router, urlencoded, Request, Response } from 'express';
import profile from './profile.js';
import password from './password.js';
import myOrders from './my-orders.js';
import { loggedOnlyRoute } from '@/router/guard/logged.js';
const router = Router();

router.use(urlencoded({ extended: true }));

router.use('/profile', loggedOnlyRoute, profile);
router.use('/password', loggedOnlyRoute, password);
router.use('/my-orders', loggedOnlyRoute, myOrders);

router.use('/', loggedOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/account/profile');
});

export default router;
