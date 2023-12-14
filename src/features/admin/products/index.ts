import { Router, urlencoded, Request, Response } from 'express';
import {
  getProductList,
  getProductToUpdate,
  productCreate,
  productDelete,
  productUpdate,
} from './utils';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/delete/:id', (req: Request, res: Response) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(204).send('NOK');
  } else {
    productDelete(req.session, res, productId);
  }
});

router.post('/create', (req: Request, res: Response) => {
  productCreate(res, req.body, req.session);
});

router.use('/create', (req: Request, res: Response) => {
  res.render('productCreate.ejs', {
    product: undefined,
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

router.post('/update/:id', (req: Request, res: Response) => {
  const productId = req.params.id;

  if (!productId) {
    res.status(204).send('NOK');
  } else {
    productUpdate(res, req.body, productId, req.session);
  }
});

router.use('/update/:id', (req: Request, res: Response) => {
  const productId = req.params.id;

  if (!productId) {
    res.status(204).send('NOK');
  } else {
    getProductToUpdate(req, res, productId);
  }
});

router.use('/', (req: Request, res: Response) => {
  getProductList(req, res);
});

export default router;
