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
import { databaseConnect } from '../../database/index.js';
import { toastDispatch, toastEmpty } from '../../components/toast/index.js';
export const getAllProductsWithCategory = (req, res
//filter?: string
) => {
    const connection = databaseConnect();
    const getProductsQuery = 'SELECT p.*, c.name AS category FROM products p JOIN product_categories pc ON p.productId = pc.productId JOIN categories c ON pc.categoryId = c.categoryId;';
    const getCategoriesQuery = `SELECT * FROM categories;`;
    connection.query(getCategoriesQuery, (error, categoryResults) => {
        if (error)
            res.status(404).render('404.ejs');
        connection.query(getProductsQuery, (error, productResults) => {
            if (error)
                res.status(502).render('shop.ejs', {
                    error: { state: true, message: error.message },
                    categories: categoryResults,
                    products: undefined,
                    currentCategory: '',
                    isLogged: req.session.isLogged,
                    account: req.session.user,
                    toast: toastEmpty(),
                    cart: req.session.cart,
                });
            const products = productResults.map((product) => {
                const { category } = product, rest = __rest(product, ["category"]);
                return Object.assign({ category: category.toLowerCase() }, rest);
            });
            res.status(200).render('shop.ejs', {
                error: { state: false, message: '' },
                categories: categoryResults,
                products: products,
                currentCategory: '',
                isLogged: req.session.isLogged,
                account: req.session.user,
                toast: toastDispatch(req),
                cart: req.session.cart,
            });
            connection.end();
        });
    });
};
export const renderCategoryPage = ({ req, res, currentCategory, isOnlyOffers = false, isSortedByPrice = false, isSortedByName = false, }) => {
    const connection = databaseConnect();
    const getCategoriesQuery = `SELECT * FROM categories;`;
    connection.query(getCategoriesQuery, (error, categoryResults) => {
        if (error)
            res.status(404).render('404.ejs');
        const getProductsFromCategoryQuery = `SELECT products.* FROM products
        JOIN product_categories ON products.productId = product_categories.productId
        JOIN categories ON product_categories.categoryId = categories.categoryId
        WHERE categories.name = "${currentCategory}"
        ${isOnlyOffers ? 'AND products.sale = 1' : ''}
        ${isSortedByPrice && !isSortedByName
            ? 'ORDER BY products.price ASC'
            : ''}
        ${isSortedByName && !isSortedByPrice ? 'ORDER BY products.name ASC' : ''};`;
        connection.query(getProductsFromCategoryQuery, (error, productResults) => {
            if (error)
                res.render('shop.ejs', {
                    error: { state: false, message: error.message },
                    categories: categoryResults,
                    products: undefined,
                    currentCategory: currentCategory,
                    isLogged: req.session.isLogged,
                    account: req.session.user,
                    toast: toastDispatch(req),
                    cart: req.session.cart,
                });
            const products = productResults.map((product) => {
                return Object.assign({ category: currentCategory.toLowerCase() }, product);
            });
            res.render('shop.ejs', {
                error: { state: false, message: '' },
                categories: categoryResults,
                products: products,
                currentCategory: currentCategory,
                isLogged: req.session.isLogged,
                account: req.session.user,
                toast: toastDispatch(req),
                cart: req.session.cart,
            });
            connection.end();
        });
    });
};
export const renderProductPage = ({ req, res, currentCategory, productId, }) => {
    const connection = databaseConnect();
    connection.query(`SELECT * from products WHERE productId = ${productId};`, (error, results) => {
        if (error)
            throw new Error(error.message);
        res.render('product.ejs', {
            product: results[0],
            currentCategory: currentCategory,
            isLogged: req.session.isLogged,
            account: req.session.user,
            cart: req.session.cart,
        });
    });
};
