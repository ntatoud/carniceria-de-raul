import { generateSaltHashedPassword, isPasswordCorrect, } from '../../../features/auth/util.js';
import { databaseConnect } from '../../../database/index.js';
import { toastError, toastSuccess } from '../../../components/toast/index.js';
export const passwordUpdateIfOldPasswordCorrect = (req, res, userPasswordData) => {
    var _a;
    const connection = databaseConnect();
    const selectQuery = 'SELECT password, salt FROM users WHERE userId = ?';
    const selectQueryParams = [(_a = req.session.user) === null || _a === void 0 ? void 0 : _a.userId];
    connection.execute(selectQuery, selectQueryParams, (error, result) => {
        if (error)
            throw new Error(error.message);
        if (isPasswordCorrect(userPasswordData.oldPassword, result[0])) {
            passwordUpdate(req, res, connection, userPasswordData.newPassword);
        }
        else {
            req.session.toast = toastError({ content: 'Wrong password' });
            res.redirect('/account/password');
        }
    });
};
const passwordUpdate = (req, res, connection, newPassword) => {
    var _a;
    const { salt, hashPwd } = generateSaltHashedPassword(newPassword);
    const updateQuery = 'UPDATE users SET \
    salt = ?,\
    password = ?\
    WHERE userId = ?;';
    const queryParams = [salt, hashPwd, (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.userId];
    connection.execute(updateQuery, queryParams, (error) => {
        if (error)
            throw new Error(error.message);
        req.session.toast = toastSuccess({
            content: 'Password updated succesfully',
        });
        res.redirect('/account/profile');
        connection.end();
    });
};
