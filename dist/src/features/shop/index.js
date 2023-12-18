import { Router } from 'express';
import { getAllProductsWithCategory, renderCategoryPage, renderProductPage, } from './utils.js';
const router = Router();
router.get('/:category/:productId', (req, res) => {
    const currentCategory = req.params.category;
    const productId = req.params.productId;
    if (!productId || !currentCategory) {
        res.status(204).send('NOK');
    }
    else {
        renderProductPage({ req, res, currentCategory, productId });
    }
});
router.get('/:category', (req, res) => {
    const currentCategory = req.params.category;
    const isOnlyOffers = req.url.includes('ofertas=on');
    const isSortedByPrice = req.url.includes('price=on');
    const isSortedByName = req.url.includes('name=on');
    if (!currentCategory) {
        res.status(204).send('NOK');
    }
    else {
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
router.use('/', (req, res) => {
    getAllProductsWithCategory(req, res);
});
export default router;
