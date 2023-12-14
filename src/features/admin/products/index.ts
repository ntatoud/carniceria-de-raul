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

router.delete('/', (req: Request, res: Response) => {
  const productId = req.body.id;
  if (!productId) {
    res.status(204).send('NOK');
  } else {
    productDelete(res, productId);
  }
});

router.post('/create', (req: Request, res: Response) => {
  productCreate(res, req.body);
});

router.put('/:id', (req: Request, res: Response) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(204).send('NOK');
  } else {
    productUpdate(res, req.body, productId);
  }
});

router.use('/create', (req: Request, res: Response) => {
  res.render('productCreate.ejs', {
    product: undefined,
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

router.use('/:id', (req: Request, res: Response) => {
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
