import { Router, urlencoded, Request, Response } from 'express';
import { getOrderFromId, getOrderList, orderDelete } from './utils';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/delete/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (!orderId) {
    res.status(204).send('NOK');
  } else {
    orderDelete(res, orderId);
  }
});

router.use('/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (!orderId) {
    res.status(204).send('NOK');
  } else {
    getOrderFromId(req, res, orderId);
  }
});

router.use('/', (req: Request, res: Response) => {
  getOrderList(req, res);
});

export default router;
