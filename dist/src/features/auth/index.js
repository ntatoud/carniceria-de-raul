import { Router, urlencoded } from 'express';
import signup from './signup/index.js';
import login from './login/index.js';
import reset from './reset/index.js';
import { guestOnlyRoute } from '../../middlewares/guest.js';
import { loggedOnlyRoute } from '../../middlewares/logged.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.use('/reset', guestOnlyRoute, reset);
router.use('/login', guestOnlyRoute, login);
router.use('/signup', guestOnlyRoute, signup);
router.use('/logout', loggedOnlyRoute, (req, res) => {
    req.session.destroy((error) => {
        if (error)
            throw new Error(error.message);
        res.redirect('/');
    });
});
router.use('/', guestOnlyRoute, (req, res) => {
    res.redirect('/auth/login');
});
export default router;
