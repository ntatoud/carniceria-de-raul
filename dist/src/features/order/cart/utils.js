import { databaseConnect } from '../../../database/index.js';
export const getCartQuery = 'SELECT p.*, ucp.totalQuantity, ucp.weight, c.name as category\
    FROM users_cart_products ucp\
    JOIN products p ON ucp.productId = p.productId\
    JOIN product_categories pc ON ucp.productId = pc.productId\
    JOIN categories c ON pc.categoryId = c.categoryId\
    WHERE ucp.userId = ?;';
export const setCartProductsTotalPrices = (cart) => {
    cart.map((cartProduct) => {
        cartProduct.totalPrice =
            cartProduct.unit == '€/kg'
                ? (cartProduct.price * cartProduct.totalQuantity * cartProduct.weight) /
                    1000
                : cartProduct.price * cartProduct.totalQuantity;
        if (!!cartProduct.sale && cartProduct.salePrice)
            cartProduct.totalSalePrice =
                cartProduct.unit == '€/kg'
                    ? (cartProduct.salePrice *
                        cartProduct.totalQuantity *
                        cartProduct.weight) /
                        1000
                    : cartProduct.price * cartProduct.totalQuantity;
    });
};
export const cartTotalPrice = (cart, withSales) => {
    if (!cart)
        return;
    return cart.reduce((acc, cartProduct) => {
        var _a, _b;
        return acc +
            (withSales
                ? (_a = cartProduct.totalSalePrice) !== null && _a !== void 0 ? _a : cartProduct.totalPrice
                : (_b = cartProduct.totalPrice) !== null && _b !== void 0 ? _b : 0);
    }, 0);
};
export const renderCart = (req, res) => {
    res.render('cart.ejs', {
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
        totalPrice: cartTotalPrice(req.session.cart),
        totalSalePrice: cartTotalPrice(req.session.cart, true),
    });
};
export const cartProductDelete = (session, productId, weight, res) => {
    var _a;
    const connection = databaseConnect();
    const deleteQuery = `DELETE FROM users_cart_products WHERE userId = ? AND productId = ? AND weight = ?;`;
    connection.query(deleteQuery, [(_a = session.user) === null || _a === void 0 ? void 0 : _a.userId, +productId, +weight], (error) => {
        if (error)
            throw new Error(error.message);
        sendNewCart(connection, session, res);
    });
};
export const cartProductUpdate = (session, productId, weight, quantityToAdd, res) => {
    var _a, _b;
    const currentProduct = () => {
        var _a;
        return (_a = session.cart) === null || _a === void 0 ? void 0 : _a.find((cartProduct) => cartProduct.productId === productId && cartProduct.weight === weight);
    };
    const currentQuantity = (_a = currentProduct()) === null || _a === void 0 ? void 0 : _a.totalQuantity;
    const userId = (_b = session.user) === null || _b === void 0 ? void 0 : _b.userId;
    const newTotalQuantity = currentQuantity
        ? currentQuantity + quantityToAdd
        : quantityToAdd;
    const addToCartQuery = 'REPLACE INTO users_cart_products (userId, productId, totalQuantity, weight) VALUES (?, ?, ?, ?);';
    const connection = databaseConnect();
    connection.execute(addToCartQuery, [userId, productId, newTotalQuantity, weight], (error) => {
        if (error)
            throw new Error(error.message);
        sendNewCart(connection, session, res, currentProduct);
    });
};
const sendNewCart = (connection, session, res, currentProduct) => {
    var _a;
    const getNewCartQuery = getCartQuery;
    connection.execute(getNewCartQuery, [(_a = session.user) === null || _a === void 0 ? void 0 : _a.userId], (error, results) => {
        var _a, _b;
        if (error)
            throw new Error(error.message);
        session.cart = results;
        setCartProductsTotalPrices(session.cart);
        if (currentProduct) {
            res.status(200).send({
                newCartSize: session.cart.length,
                newProductTotalPrice: (_a = currentProduct()) === null || _a === void 0 ? void 0 : _a.totalPrice,
                newProductTotalSalePrice: (_b = currentProduct()) === null || _b === void 0 ? void 0 : _b.totalSalePrice,
                newCartTotalPrice: cartTotalPrice(session.cart),
                newCartTotalSalePrice: cartTotalPrice(session.cart, true),
            });
        }
        else {
            res.status(200).send({
                newCartSize: session.cart.length,
                newCartTotalPrice: cartTotalPrice(session.cart),
                newCartTotalSalePrice: cartTotalPrice(session.cart, true),
            });
        }
        connection.end();
    });
};
