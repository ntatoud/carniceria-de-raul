import { Router, urlencoded } from 'express';
import profile from './profile/index.js';
import password from './password/index.js';
import { loggedOnlyRoute } from '../../middlewares/logged.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.use('/profile', loggedOnlyRoute, profile);
router.use('/password', loggedOnlyRoute, password);
router.use('/', loggedOnlyRoute, (req, res) => {
    res.redirect('/account/profile');
});
export default router;
