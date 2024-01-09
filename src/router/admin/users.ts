import { Router, urlencoded, Request, Response } from 'express';
import {
  userDelete,
  getUserList,
  getUserToUpdate,
  userCreate,
  userUpdate,
} from '@/controllers/admin/usersController.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.delete('/', (req: Request, res: Response) => {
  const userId = req.body.id;
  if (!userId) {
    res.status(204).send('NOK');
  } else {
    userDelete(res, userId);
  }
});

router.post('/create', (req: Request, res: Response) => {
  userCreate(res, req.body);
});

router.put('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(204).send('NOK');
  } else {
    userUpdate(res, req.body, userId);
  }
});

router.use('/create', (req: Request, res: Response) => {
  res.render('userCreate.ejs', {
    user: undefined,
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    t: i18next.t,
  });
});

router.use('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(204).send('NOK');
  } else {
    getUserToUpdate(req, res, userId);
  }
});

router.use('/', (req: Request, res: Response) => {
  getUserList(req, res);
});

export default router;
