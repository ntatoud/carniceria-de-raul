import { Router, urlencoded, Request, Response } from 'express';
import {
  getProductList,
  getProductToUpdate,
  productCreate,
  productDelete,
  productUpdate,
} from '@/controllers/admin/productsController.js';
import { upload } from '@/lib/multer/config.js';
import i18next from '@/lib/i18n/config.js';

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

router.post(
  '/create',
  upload.single('image'),
  (req: Request, res: Response) => {
    const product = { image: req.file?.filename ?? '', ...req.body };
    productCreate(res, product);
  }
);

router.put('/:id', upload.single('image'), (req: Request, res: Response) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(204).send('NOK');
  } else {
    productUpdate(res, { image: req.file?.filename, ...req.body }, productId);
  }
});

router.use('/create', (req: Request, res: Response) => {
  res.render('productCreate.ejs', {
    product: undefined,
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    t: i18next.t,
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
