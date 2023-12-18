import { Router, urlencoded } from 'express';
const router = Router();
router.use(urlencoded({ extended: true }));
router.use('/', (req, res) => {
    res.render('reset.ejs', {
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
export default router;
