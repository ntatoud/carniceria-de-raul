import { Router, urlencoded, Request, Response } from 'express';
import {
  getOrderFromId,
  getOrderList,
  orderDelete,
  orderStatusUpdate,
} from './utils.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.put('/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  const isDone = req.body.isDone;
  if (!orderId || !isDone) {
    res.status(204).send('NOK');
  } else {
    orderStatusUpdate(res, orderId, isDone);
  }
});

router.delete('/', (req: Request, res: Response) => {
  const orderId = req.body.id;
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
