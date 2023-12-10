import { Request, Response, Router } from 'express';
import cart from './cart';
import infos from './infos';
import payment from './payment';
import { loggedOnlyRoute } from '../../middlewares/logged';

const router = Router();

router.use('/cart', loggedOnlyRoute, cart);
router.use('/infos', loggedOnlyRoute, infos);
router.use('/payment', loggedOnlyRoute, payment);

router.use('/', loggedOnlyRoute, (req: Request, res: Response) => {
    res.redirect('/order/cart');
});

export default router;
