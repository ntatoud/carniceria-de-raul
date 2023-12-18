import { toastError } from '../components/toast/index.js';
export const adminOnlyRoute = (req, res, next) => {
    var _a;
    if (req.session.isLogged && ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.authorities) === 'ROLE_ADMIN') {
        next();
    }
    else {
        req.session.toast = toastError({
            content: 'Access Forbidden ',
        });
        res.redirect('/');
    }
};
