import { Request, Response, Router } from 'express';
import cart from './cart.js';
import infos from './infos.js';
import payment from './payment.js';
import { loggedOnlyRoute } from '@/router/guard/logged.js';

const router = Router();

router.use('/cart', cart);
router.use('/infos', loggedOnlyRoute, infos);
router.use('/payment', loggedOnlyRoute, payment);

router.use('/', loggedOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/order/cart');
});

export default router;
