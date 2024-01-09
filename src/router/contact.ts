import { Router, Response, Request } from 'express';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use('/', (req: Request, res: Response) => {
  res.render('contact.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
    t: i18next.t,
  });
});

export default router;
