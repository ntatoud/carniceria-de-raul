import { toastSuccess } from '../../../components/toast/index.js';
import { databaseConnect } from '../../../database/index.js';
import { getCartQuery, setCartProductsTotalPrices, } from '../../../features/order/cart/utils.js';
export const createSession = (res, session, userData) => {
    const getUserCartQuery = getCartQuery;
    const connection = databaseConnect();
    connection.execute(getUserCartQuery, [userData.userId], (error, results) => {
        if (error)
            throw new Error(error.message);
        session.user = Object.assign({}, userData);
        session.cart = results;
        setCartProductsTotalPrices(session.cart);
        session.isLogged = true;
        session.toast = toastSuccess({ content: 'You are now connected' });
        res.status(200).redirect('/');
    });
};
