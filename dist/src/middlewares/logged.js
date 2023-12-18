import { toastError } from '../components/toast/index.js';
export const loggedOnlyRoute = (req, res, next) => {
    if (req.session.isLogged) {
        next();
    }
    else {
        req.session.toast = toastError({ content: 'You must be connected' });
        res.redirect('/');
    }
};
