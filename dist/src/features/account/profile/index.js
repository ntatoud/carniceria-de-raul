import { Router } from 'express';
import { accountUpdate } from './utils.js';
import { toastDispatch } from '../../../components/toast/index.js';
const router = Router();
router.post('/', (req, res) => {
    accountUpdate(req, res, req.body);
});
router.use('/', (req, res) => {
    var _a, _b;
    res.render('profile.ejs', {
        accountName: (_b = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Usuario',
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.cart,
    });
});
export default router;
