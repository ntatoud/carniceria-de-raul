import { Router, urlencoded, Request, Response } from 'express';
import signup from './signup/index.js';
import login from './login/index.js';
import reset from './reset/index.js';
import update from './update/index.js';
import { guestOnlyRoute } from '@/middlewares/guest.js';
import { loggedOnlyRoute } from '@/middlewares/logged.js';
const router = Router();
router.use(urlencoded({ extended: true }));

router.use('/reset', guestOnlyRoute, reset);
router.use('/login', guestOnlyRoute, login);
router.use('/signup', guestOnlyRoute, signup);
router.use('/update', guestOnlyRoute, update);

router.use('/logout', loggedOnlyRoute, (req: Request, res: Response) => {
  req.session.destroy((error: ErrorEvent) => {
    if (error) console.error(error);
    res.cookie('cart', [] as Cart);
    res.redirect('/');
  });
});

router.use('/', guestOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/auth/login');
});

export default router;
