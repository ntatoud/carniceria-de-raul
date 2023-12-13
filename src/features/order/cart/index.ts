import { Request, Response, Router, urlencoded } from 'express';

const router = Router();

router.use(urlencoded({ extended: true }));

router.use('/', (req: Request, res: Response) => {
  console.log(req.session.cart);
  res.render('cart.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    products: req.session.cart,
  });
});

export default router;
