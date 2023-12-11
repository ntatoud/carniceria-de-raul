import { Router, Response, Request } from 'express';
import {
  getAllProductsWithCategory,
  renderCategoryPage,
  renderProductPage,
} from './utils';
const router = Router();

router.use('/:category/:productId', (req: Request, res: Response) => {
  const currentCategory = req.params.category ?? '';
  const productId = req.params.productId ?? 0;

  renderProductPage({ req, res, currentCategory, productId });
});

router.get('/:category', (req: Request, res: Response) => {
  const currentCategory = req.params.category;
  const isOnlyOffers = req.url.includes('ofertas=on');
  const isSortedByPrice = req.url.includes('price=on');
  const isSortedByName = req.url.includes('name=on');

  renderCategoryPage({
    req,
    res,
    currentCategory,
    isOnlyOffers,
    isSortedByPrice,
    isSortedByName,
  });
});

router.use('/', (req: Request, res: Response) => {
  getAllProductsWithCategory(req, res);
});

export default router;
