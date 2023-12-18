import { Router, urlencoded } from 'express';
import { getProductList, getProductToUpdate, productCreate, productDelete, productUpdate, } from './utils.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.delete('/', (req, res) => {
    const productId = req.body.id;
    if (!productId) {
        res.status(204).send('NOK');
    }
    else {
        productDelete(res, productId);
    }
});
router.post('/create', (req, res) => {
    productCreate(res, req.body);
});
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        res.status(204).send('NOK');
    }
    else {
        productUpdate(res, req.body, productId);
    }
});
router.use('/create', (req, res) => {
    res.render('productCreate.ejs', {
        product: undefined,
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
router.use('/:id', (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        res.status(204).send('NOK');
    }
    else {
        getProductToUpdate(req, res, productId);
    }
});
router.use('/', (req, res) => {
    getProductList(req, res);
});
export default router;
