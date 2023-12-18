import { Router, urlencoded } from 'express';
import { isStrongPassword } from '../../../features/auth/signup/utils.js';
import { passwordUpdateIfOldPasswordCorrect } from './utils.js';
import { toastDispatch } from '../../../components/toast/index.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.post('/checkPassword', (req, res) => {
    const { isStrong, problems } = isStrongPassword(req.body.password);
    res.status(200).send(isStrong ? 'OK' : problems);
});
router.post('/', (req, res) => {
    passwordUpdateIfOldPasswordCorrect(req, res, {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
    });
});
router.use('/', (req, res) => {
    var _a, _b;
    res.render('password.ejs', {
        error: {},
        accountName: (_b = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Usuario',
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.cart,
    });
});
export default router;
