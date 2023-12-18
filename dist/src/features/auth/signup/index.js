import { Router, urlencoded } from 'express';
import { checkEmailTaken, isStrongPassword, registerIfPossible, } from './utils.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.post('/checkEmail', (req, res) => {
    checkEmailTaken(res, req.body.email);
});
router.post('/checkPassword', (req, res) => {
    const { isStrong, problems } = isStrongPassword(req.body.password);
    res.status(200).send(isStrong ? 'OK' : problems);
});
router.post('/', (req, res) => {
    registerIfPossible(req.session, res, req.body);
});
router.use('/', (req, res) => {
    res.render('signup.ejs', {
        error: {},
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
export default router;
