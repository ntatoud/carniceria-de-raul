import { Router, urlencoded } from 'express';
import { getOrderFromId, getOrderList, orderDelete } from './utils.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.post('/delete/:id', (req, res) => {
    const orderId = req.params.id;
    if (!orderId) {
        res.status(204).send('NOK');
    }
    else {
        orderDelete(res, orderId);
    }
});
router.use('/:id', (req, res) => {
    const orderId = req.params.id;
    if (!orderId) {
        res.status(204).send('NOK');
    }
    else {
        getOrderFromId(req, res, orderId);
    }
});
router.use('/', (req, res) => {
    getOrderList(req, res);
});
export default router;
