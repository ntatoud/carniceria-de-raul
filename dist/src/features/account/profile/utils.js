import { toastSuccess } from '../../../components/toast/index.js';
import { databaseConnect } from '../../../database/index.js';
export const accountUpdate = (req, res, user) => {
    var _a;
    const connection = databaseConnect();
    const updateQuery = 'UPDATE users SET \
    name = ?,\
    surname = ?,\
    email = ?,\
    phone = ?,\
    address = ?, \
    city = ?, \
    postalCode = ?, \
    country = ? \
    WHERE userId = ?;';
    const queryParams = [
        user.name,
        user.surname,
        user.email,
        user.phone,
        user.address,
        user.city,
        user.postalCode,
        user.country,
        (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.userId,
    ];
    req.session.user = user;
    connection.execute(updateQuery, queryParams, (error) => {
        if (error)
            throw new Error(error.message);
        req.session.toast = toastSuccess({
            content: 'Your account has been updated successfully',
        });
        res.redirect('/account/profile');
    });
};
