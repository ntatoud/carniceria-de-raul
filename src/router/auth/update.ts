import { Router, urlencoded, Request, Response } from 'express';
import { toastDispatch } from '@/components/toast/index.js';
import { isStrongPassword } from '@/controllers/auth/signupController.js';
import { updatePassword } from '@/controllers/auth/updateController.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/checkPassword', (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? 'OK' : problems);
});

router.post('/', (req: Request, res: Response) => {
  updatePassword(req, res);
});

router.use('/', (req: Request, res: Response) => {
  const token = req.query.token;
  res.render('update.ejs', {
    toast: toastDispatch(req),
    token,
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
    t: i18next.t,
  });
});

export default router;
