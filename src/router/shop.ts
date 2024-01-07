import { Router, Response, Request } from 'express';
import {
  getAllProductsWithCategory,
  renderCategoryPage,
  renderProductPage,
} from '@/controllers/shopController.js';
const router = Router();

router.get('/:category/:productId', (req: Request, res: Response) => {
  const currentCategory = req.params.category;
  const productId = req.params.productId;

  if (!productId || !currentCategory) {
    res.status(204).send('NOK');
  } else {
    renderProductPage({ req, res, currentCategory, productId });
  }
});

router.get('/:category', (req: Request, res: Response) => {
  const currentCategory = req.params.category;
  const isOnlyOffers = req.url.includes('ofertas=on');
  const isSortedByPrice = req.url.includes('price=on');
  const isSortedByName = req.url.includes('name=on');

  if (!currentCategory) {
    res.status(204).send('NOK');
  } else {
    renderCategoryPage({
      req,
      res,
      currentCategory,
      isOnlyOffers,
      isSortedByPrice,
      isSortedByName,
    });
  }
});

router.use('/', (req: Request, res: Response) => {
  getAllProductsWithCategory(req, res);
});

export default router;
