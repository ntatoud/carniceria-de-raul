import { Router, Response, Request } from 'express';

const router = Router();

router.use('/', (req: Request, res: Response) => {
  res.render('about.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
  });
});

export default router;
