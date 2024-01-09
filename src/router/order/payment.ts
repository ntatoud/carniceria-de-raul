import { Request, Response, Router, urlencoded } from 'express';
import { cartTotalPrice } from '@/controllers/order/cartController.js';
import { createOrderFromSession } from '@/controllers/order/paymentController.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.post('/pay', async (req, res) => {
  const totalPrice = cartTotalPrice(req.session.cart);

  if (!totalPrice) {
    res.sendStatus(502);
  } else {
    const amount = Math.round(+totalPrice.toFixed(2) * 100);
    createOrderFromSession(req, res, amount);
  }
});
router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  res.render('payment.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    cartPrice: cartTotalPrice(req.session.cart),
    t: i18next.t,
  });
});

export default router;
