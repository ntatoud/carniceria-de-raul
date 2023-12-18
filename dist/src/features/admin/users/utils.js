import { generateSaltHashedPassword } from '../../../features/auth/util.js';
import { databaseConnect } from '../../../database/index.js';
import { toastDispatch } from '../../../components/toast/index.js';
export const userCreate = (res, user) => {
    const connection = databaseConnect();
    const { salt, hashPwd } = generateSaltHashedPassword('admin');
    const queryParams = [
        user.email,
        hashPwd,
        salt,
        user.authorities,
        user.name,
        user.surname,
    ];
    const createUserQuery = 'INSERT INTO users (email, password, salt, authorities, name, surname) VALUES (?, ?, ?, ?, ?, ?);';
    connection.query(createUserQuery, queryParams, (error) => {
        if (error) {
            throw new Error(error.message);
        }
        else {
            res.redirect(302, '/admin/users');
        }
    });
};
export const userUpdate = (res, user, id) => {
    const connection = databaseConnect();
    const queryParams = [
        user.email,
        user.authorities,
        user.name,
        user.surname,
        id,
    ];
    const updateUserQuery = 'UPDATE users SET email = ?, authorities = ?, name = ?, surname = ? WHERE userId = ?;';
    connection.query(updateUserQuery, queryParams, (error) => {
        if (error)
            throw new Error(error.message);
        else {
            res.sendStatus(200);
        }
    });
};
export const getUserToUpdate = (req, res, id) => {
    const getUserQuery = 'SELECT userId, email, name, surname, authorities FROM users WHERE userId= ?;';
    const connection = databaseConnect();
    connection.query(getUserQuery, [id], (error, result) => {
        if (error) {
            throw new Error(error.message);
        }
        else {
            res.render('userUpdate.ejs', {
                user: result[0],
                isLogged: req.session.isLogged,
                account: req.session.user,
                cart: req.session.cart,
            });
        }
    });
};
export const getUserList = (req, res) => {
    const connection = databaseConnect();
    connection.query('SELECT name, surname, email, userId, authorities FROM users;', (error, results) => {
        if (error) {
            res.send('404');
            throw new Error(error.message);
        }
        res.render('users.ejs', {
            users: results,
            isLogged: req.session.isLogged,
            account: req.session.user,
            toast: toastDispatch(req),
            cart: req.session.cart,
        });
    });
};
export const userDelete = (res, userId) => {
    const connection = databaseConnect();
    const deleteQuery = `DELETE FROM users WHERE userId = ?;`;
    connection.query(deleteQuery, [userId], (error) => {
        if (error)
            throw new Error(error.message);
        res.status(200).send('OK');
    });
};
