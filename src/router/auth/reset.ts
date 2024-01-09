import { Router, urlencoded, Request, Response } from 'express';
import { toastDispatch } from '@/components/toast/index.js';
import { sendResetMailToUserEmail } from '@/controllers/auth/resetController.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/', (req: Request, res: Response) => {
  sendResetMailToUserEmail(req, res);
});

router.use('/', (req: Request, res: Response) => {
  res.render('reset.ejs', {
    toast: toastDispatch(req),
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
    t: i18next.t,
  });
});

export default router;
