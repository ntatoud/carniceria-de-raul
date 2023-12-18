import { Router, urlencoded } from 'express';
import { databaseConnect } from '../../../database/index.js';
import { toastSuccess } from '../../../components/toast/index.js';
import { cartTotalPrice } from '../cart/utils.js';
const router = Router();
router.use(urlencoded({ extended: true }));
router.post('/', (req, res) => {
    var _a;
    try {
        const { city, postalCode, country, address, phone, recoveryDay, recoveryTime, comment, email, } = req.body;
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId === undefined) {
            return res.status(401).send('User not authenticated.');
        }
        const connection = databaseConnect();
        const updateUserQuery = `
      UPDATE users
      SET city = ?,
          postalCode = ?,
          country = ?,
          address = ?,
          phone = ?
      WHERE userId = ?;`;
        connection.query(updateUserQuery, [city, postalCode, country, address, phone, userId], (error) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).send('Error updating user data.');
            }
            const updateOrderQuery = `
          INSERT INTO orders (userId, recoveryDay, recoveryTime, comment, email, totalPrice)
          VALUES (?, ?, ?, ?, ?, ?);`;
            connection.query(updateOrderQuery, [
                userId,
                recoveryDay,
                recoveryTime,
                comment,
                email,
                cartTotalPrice(req.session.cart, true),
            ], (err) => {
                connection.end();
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).send('Error updating order data.');
                }
                req.session.toast = toastSuccess({ content: 'Success' });
                res.status(200).redirect('/order/payment');
            });
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error updating data.');
    }
});
router.use('/', (req, res) => {
    // Your existing logic for rendering the view
    res.render('infos.ejs', {
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
export default router;
