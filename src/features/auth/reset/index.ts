import { Router, urlencoded, Request, Response } from 'express';

const router = Router();

router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  res.render('reset.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
  });
});

export default router;
