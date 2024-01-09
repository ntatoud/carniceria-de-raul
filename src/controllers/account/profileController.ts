import { toastSuccess } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import i18next from '@/lib/i18n/config.js';
import { User } from '@/types/types.js';
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
    user.phone ?? null,
    user.address ?? null,
    user.city ?? null,
    user.postalCode ?? null,
    user.country ?? null,
    req.session.user?.userId,
  ];
  console.log(queryParams);
  req.session.user = user;

  connection.execute(updateQuery, queryParams, (error: QueryError | null) => {
    if (error) databaseError(error);

    req.session.toast = toastSuccess({
      content: i18next.t('main:toast.success.accountUpdate'),
    });
    res.redirect('/account/profile');

    databaseDisconnect(connection);
  });
};
