import { Request, Response, Router, urlencoded } from 'express';
import { cartProductDelete, cartProductUpdate, renderCart } from './utils.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.put('/', (req: Request, res: Response) => {
  const quantityToAdd = +req.body.quantity;
  const weight = +req.body.weight;
  const productId = +req.body.productId;
  cartProductUpdate(req, res, productId, weight, quantityToAdd);
});

router.delete('/', (req: Request, res: Response) => {
  const [productId, weight]: [string, string] = req.body.id.split('-');
  if (!productId || !weight) {
    res.status(204).send('NOK');
  } else {
    cartProductDelete(req, res, +productId, +weight);
  }
});

router.use('/', (req: Request, res: Response) => {
  renderCart(req, res);
});

export default router;
