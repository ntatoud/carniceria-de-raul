import { Request, Response, Router, urlencoded } from 'express';
import env from 'dotenv';
import Stripe from 'stripe';

import { toastDispatch } from '@/components/toast/index.js';
import { cartTotalPrice } from '../cart/utils.js';

env.config();
const router = Router();
const stripeSecretKey = 'sk_test_51OS0DKLo0ku5dcyTnWWdD89FzgYWZQ0u2wa3SKh16V0ix9ZLmvnOtXMb387RZdQLS9lWahULyXRr552RmXbPRYiT00eu72IxtL';

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

// Now create the Stripe instance using the verified stripeSecretKey
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  res.render('payment.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    toast: toastDispatch(req),
  });
});

router.post('/procesar-pago', async (req, res) => {
  const paymentMethodId = req.body.paymentMethodId;

  try {
    // Get the total amount from the cart (replace this with your logic)
    const amount = cartTotalPrice(req.session.cart) || 0;

    // Create a PaymentIntent using the payment method and amount
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ['card'],
      amount: amount,
      currency: 'eur',
      confirmation_method: 'manual',
      confirm: true,
    });

    //Clear cart after payment
    req.session.cart = [];

    // If payment is confirmed successfully, render a success page
    const toast = localStorage.getItem('toast');
    if(toast === 'update'){
      toastSuccess('¡Pago realizado con éxito!');
    }
  } catch (error) {
    console.error(error);
    // Handle errors and render an error page
    res.render('error', { error: error });
  }
});

export default router;

