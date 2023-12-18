var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Router, urlencoded } from 'express';
import { isPasswordCorrect } from '../../../features/auth/util.js';
import { databaseConnect } from '../../../database/index.js';
import { createSession } from './utils.js';
import { toastDispatch, toastError } from '../../../components/toast/index.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.post('/', (req, res) => {
    const { email, password } = req.body;
    const connection = databaseConnect(); // Establish database connection
    const selectQuery = `
      SELECT *
      FROM users
      WHERE email = ?`;
    connection.execute(selectQuery, [email], (error, result) => {
        if (error)
            res.status(502).render('login.ejs', {
                error: { state: true, message: error.message },
            });
        if (result.length) {
            const userData = result[0];
            if (userData && isPasswordCorrect(password, userData)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { salt, password } = userData, safeUser = __rest(userData, ["salt", "password"]);
                // Passwords match, login successful, we create the session
                createSession(res, req.session, safeUser);
            }
            else {
                req.session.toast = toastError({ content: 'Invalid Credentials' });
                res.status(401).redirect('/auth');
            }
        }
        else {
            req.session.toast = toastError({ content: 'Invalid Credentials' });
            res.status(401).redirect('/auth');
        }
    });
    connection.end();
});
router.use('/', (req, res) => {
    res.render('login.ejs', {
        toast: toastDispatch(req),
        error: {},
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
export default router;
