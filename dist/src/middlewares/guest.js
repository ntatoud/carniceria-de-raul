import { toastError } from '../components/toast/index.js';
export const guestOnlyRoute = (req, res, next) => {
    if (!req.session.isLogged) {
        next();
    }
    else {
        req.session.toast = toastError({ content: 'You are already connected' });
        res.redirect('/');
    }
};
