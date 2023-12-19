import { toastSuccess } from '@/components/toast/index.js';
import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import { User } from '@/features/types.js';
import { Request, Response } from 'express';
import { QueryError } from 'mysql2';

export const accountUpdate = (req: Request, res: Response, user: User) => {
  const connection = databaseConnect();
  const updateQuery =
    'UPDATE users SET \
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
    req.session.user?.userId,
  ];
  req.session.user = user;

  connection.execute(updateQuery, queryParams, (error: QueryError | null) => {
    if (error) console.error(error.message);

    req.session.toast = toastSuccess({
      content: 'Your account has been updated successfully',
    });
    res.redirect('/account/profile');

    databaseDisconnect(connection);
  });
};
