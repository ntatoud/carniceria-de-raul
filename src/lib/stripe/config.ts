import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) throw new Error('No Stripe secret key provided');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export default stripe;
