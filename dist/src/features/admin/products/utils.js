import { toastDispatch } from '../../../components/toast/index.js';
import { databaseConnect } from '../../../database/index.js';
export const productCreate = (res, product) => {
    var _a, _b;
    const connection = databaseConnect();
    const queryParams = [
        product.name,
        product.price,
        product.stock,
        product.sale,
        (_a = product.salePrice) !== null && _a !== void 0 ? _a : null,
        (_b = product.image) !== null && _b !== void 0 ? _b : '',
        product.description,
    ];
    const createProductQuery = 'INSERT INTO products (name, price, stock, sale, salePrice, image, description) VALUES (?, ?, ?, ?, ?, ?, ?);';
    connection.query(createProductQuery, queryParams, (error) => {
        if (error) {
            throw new Error(error.message);
        }
        else {
            res.sendStatus(200);
        }
    });
};
export const productUpdate = (res, product, id) => {
    var _a, _b;
    const connection = databaseConnect();
    const queryParams = [
        product.name,
        product.price,
        product.stock,
        product.sale,
        (_a = product.salePrice) !== null && _a !== void 0 ? _a : null,
        (_b = product.image) !== null && _b !== void 0 ? _b : '',
        product.description,
        id,
    ];
    const updateProductQuery = 'UPDATE products SET name = ?, price = ?, stock = ?, sale = ?, salePrice = ?, image = ?, description = ? WHERE productId = ?;';
    connection.query(updateProductQuery, queryParams, (error) => {
        if (error)
            throw new Error(error.message);
        else {
            res.sendStatus(200);
        }
    });
};
export const getProductToUpdate = (req, res, productId) => {
    const connection = databaseConnect();
    // To use once merged in main !
    // const getProductQuery =
    //   "SELECT p.product_id, p.name p.price, p.stock, p.sale, p.salerice, p.image, p.description, c.name AS category FROM products p JOIN product_category pc ON p.product_id = pc.product_id JOIN category c ON pc.category_id = c.id;";
    const getProductQuery = 'SELECT * FROM products WHERE productId = ?;';
    connection.query(getProductQuery, [productId], (error, result) => {
        if (error)
            throw new Error(error.message);
        const product = result[0];
        res.render('productUpdate.ejs', {
            product: product,
            isLogged: req.session.isLogged,
            account: req.session.user,
            cart: req.session.cart,
        });
    });
};
export const productDelete = (res, productId) => {
    const connection = databaseConnect();
    const deleteQuery = `DELETE FROM products WHERE productId = ?;`;
    connection.query(deleteQuery, [productId], (error) => {
        if (error)
            throw new Error(error.message);
        res.status(200).send('OK');
    });
};
export const getProductList = (req, res
// category?: string
) => {
    const connection = databaseConnect();
    const getProductsQuery = 'SELECT * from products;';
    connection.query(getProductsQuery, (error, results) => {
        if (error)
            throw new Error(error.message);
        res.render('products.ejs', {
            products: results,
            isLogged: req.session.isLogged,
            account: req.session.user,
            toast: toastDispatch(req),
            cart: req.session.cart,
        });
    });
};
export const addCategory = () => { };
