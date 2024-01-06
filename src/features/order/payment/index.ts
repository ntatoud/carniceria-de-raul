import { Request, Response, Router, urlencoded } from 'express';
import { cartTotalPrice } from '../cart/utils.js';
import stripe from '@/lib/stripe/config.js';

const router = Router();

router.post('/pay', async (req, res) => {
  const totalPrice = cartTotalPrice(req.session.cart);

  if (!totalPrice) {
    res.sendStatus(502);
  } else {
    const formattedPrice = Math.round(+totalPrice.toFixed(2) * 100);
    try {
      stripe.paymentIntents.create({
        amount: formattedPrice,
        currency: 'usd',
        description: 'Charge for test@example.com',
      });

      res.send('Payment successful');
    } catch (err) {
      console.error(err);
      res.status;
    }
  }
});
router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  res.render('payment.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    cartPrice: cartTotalPrice(req.session.cart),
  });
});

export default router;
