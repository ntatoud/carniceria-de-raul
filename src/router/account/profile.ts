import { Router, Response, Request } from 'express';
import { accountUpdate } from '@/controllers/account/profileController.js';
import { toastDispatch } from '@/components/toast/index.js';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  accountUpdate(req, res, req.body);
});

router.use('/', (req: Request, res: Response) => {
  res.render('profile.ejs', {
    accountName: req.session.user?.name ?? 'Usuario',
    isLogged: req.session.isLogged,
    account: req.session.user,
    toast: toastDispatch(req),
    cart: req.session.cart,
  });
});

export default router;
