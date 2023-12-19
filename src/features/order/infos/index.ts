import { Router, Request, Response, urlencoded } from 'express';
import { saveOrder } from './utils.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/', (req: Request, res: Response) => {
  const orderDetails = req.body;

  const userId = req.session.user?.userId;
  if (!userId) {
    res.status(401).send('User not found.');
  } else {
    saveOrder(req.session, res, orderDetails, userId);
  }
});

router.use('/', (req: Request, res: Response) => {
  // Your existing logic for rendering the view
  res.render('infos.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
  });
});

export default router;
