import { getOrdersByUserId } from '@/controllers/account/myOrdersControllers.js';
import { getOrderFromId } from '@/controllers/admin/ordersController.js';
import { Router, urlencoded, Request, Response } from 'express';

const router = Router();

router.use(urlencoded({ extended: true }));

router.get('/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (!orderId) {
    res.status(204).send('NOK');
  } else {
    getOrderFromId(req, res, orderId);
  }
});

router.use('/', (req: Request, res: Response) => {
  if (!req.session.user?.userId) {
    res.sendStatus(403);
  } else {
    getOrdersByUserId(req, res, req.session.user.userId);
  }
});

export default router;
