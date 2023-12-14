import { Router, urlencoded, Request, Response } from 'express';
import {
  userDelete,
  getUserList,
  getUserToUpdate,
  userCreate,
  userUpdate,
} from './utils';
const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/delete/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(204).send('NOK');
  } else {
    userDelete(res, userId, req.session);
  }
});

router.post('/create', (req: Request, res: Response) => {
  userCreate(res, req.body, req.session);
});

router.post('/update/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(204).send('NOK');
  } else {
    userUpdate(res, req.body, userId, req.session);
  }
});

router.use('/create', (req: Request, res: Response) => {
  res.render('userCreate.ejs', {
    user: undefined,
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

router.use('/update/:id', (req: Request, res: Response) => {
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
