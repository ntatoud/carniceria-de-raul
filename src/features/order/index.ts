import { Request, Response, Router } from 'express';
import cart from './cart/index.js';
import infos from './infos/index.js';
import payment from './payment/index.js';
import { loggedOnlyRoute } from '@/middlewares/logged.js';

const router = Router();

router.use('/cart', cart);
router.use('/infos', loggedOnlyRoute, infos);
router.use('/payment', loggedOnlyRoute, payment);

router.use('/', loggedOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/order/cart');
});

export default router;
