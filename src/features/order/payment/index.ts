import { toastSuccess,toastError,toastDispatch} from '@/components/toast/index.js';
import { Request, Response, Router, urlencoded } from 'express';
import env from "dotenv";
import Stripe from "stripe";
import { cartTotalPrice } from '../cart/utils.js';

env.config();
const router = Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

// Now create the Stripe instance using the verified stripeSecretKey
const stripe = new Stripe(stripeSecretKey);

router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  res.render('payment.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    toast: toastDispatch(req),
  });

});
router.post('/process-payment', async (req, res) => {
  const { payment_method_id, client_name } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: payment_method_id,
      amount: (Number) (cartTotalPrice(req.session.cart))*100, // Amount in cents
      currency: 'eur',
      description: 'Payment done by : ' + client_name,
    });
    req.session.toast = toastSuccess({content: 'Payment successful'});
    res.status(200).json({ client_secret: paymentIntent.client_secret });

  } catch (error) {
    req.session.toast = toastError({content: 'Payment failed'});
    res.status(500).json({ error: "There was a problem during the transaction" });
    
  }
  res.status(401).redirect('/shop');
});

export default router;
