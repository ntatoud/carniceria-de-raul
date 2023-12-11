import { Router, urlencoded, Request, Response } from 'express';
import signup from './signup';
import login from './login';
import reset from './reset';
import { guestOnlyRoute } from '../../middlewares/guest';
import { loggedOnlyRoute } from '../../middlewares/logged';

const router = Router();
router.use(urlencoded({ extended: true }));

router.use('/reset', guestOnlyRoute, reset);
router.use('/login', guestOnlyRoute, login);
router.use('/signup', guestOnlyRoute, signup);

router.use('/logout', loggedOnlyRoute, (req: Request, res: Response) => {
  req.session.destroy((error: ErrorEvent) => {
    if (error) throw new Error(error.message);

    res.redirect('/');
  });
});

router.use('/', guestOnlyRoute, (req: Request, res: Response) => {
  res.redirect('/auth/login');
});

export default router;
