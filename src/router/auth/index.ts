import { Router, urlencoded, Request, Response } from 'express';
import signup from './signup.js';
import login from './login.js';
import reset from './reset.js';
import update from './update.js';
import { guestOnlyRoute } from '@/router/guard/guest.js';
import { loggedOnlyRoute } from '@/router/guard/logged.js';
const router = Router();
router.use(urlencoded({ extended: true }));

router.use('/reset', guestOnlyRoute, reset);
router.use('/login', guestOnlyRoute, login);
router.use('/signup', guestOnlyRoute, signup);
router.use('/update', guestOnlyRoute, update);

router.use('/logout', loggedOnlyRoute, (req: Request, res: Response) => {
  req.session.destroy((error: ErrorEvent) => {
    if (error) console.error(error);
    res.clearCookie('cookie');
    res.redirect('/auth/login');
  });
});

router.use('/', guestOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/auth/login');
});

export default router;
