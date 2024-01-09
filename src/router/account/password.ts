import { Router, urlencoded, Request, Response } from 'express';
import { isStrongPassword } from '@/controllers/auth/signupController.js';
import { passwordUpdateIfOldPasswordCorrect } from '@/controllers/account/passwordController.js';
import { toastDispatch } from '@/components/toast/index.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/checkPassword', (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? 'OK' : problems);
});

router.post('/', (req: Request, res: Response) => {
  passwordUpdateIfOldPasswordCorrect(req, res, {
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  });
});

router.use('/', (req: Request, res: Response) => {
  res.render('password.ejs', {
    error: {},
    accountName: req.session.user?.name ?? 'Usuario',
    isLogged: req.session.isLogged,
    account: req.session.user,
    toast: toastDispatch(req),
    cart: req.session.cart,
    t: i18next.t,
  });
});

export default router;
