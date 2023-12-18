import { Router, urlencoded } from 'express';
import { userDelete, getUserList, getUserToUpdate, userCreate, userUpdate, } from './utils.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.delete('/', (req, res) => {
    const userId = req.body.id;
    if (!userId) {
        res.status(204).send('NOK');
    }
    else {
        userDelete(res, userId);
    }
});
router.post('/create', (req, res) => {
    userCreate(res, req.body);
});
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(204).send('NOK');
    }
    else {
        userUpdate(res, req.body, userId);
    }
});
router.use('/create', (req, res) => {
    res.render('userCreate.ejs', {
        user: undefined,
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
router.use('/:id', (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(204).send('NOK');
    }
    else {
        getUserToUpdate(req, res, userId);
    }
});
router.use('/', (req, res) => {
    getUserList(req, res);
});
export default router;
