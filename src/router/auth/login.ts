import { Router, urlencoded, Request, Response } from 'express';
import { isPasswordCorrect } from '@/controllers/auth/authController.js';
import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import { QueryError, RowDataPacket } from 'mysql2/promise';
import { User } from '@/types/types.js';
import { createSession } from '@/controllers/auth/loginController.js';
import { toastDispatch, toastError } from '@/components/toast/index.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const connection = databaseConnect(); // Establish database connection

  const selectQuery = `
      SELECT *
      FROM users
      WHERE email = ?`;
  connection.execute(
    selectQuery,
    [email],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error)
        res.status(502).render('login.ejs', {
          error: { state: true, message: error.message },
        });

      if (result.length) {
        const userData = (result as User[])[0];
        if (userData && isPasswordCorrect(password, userData)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { salt, password, ...safeUser } = userData;

          // Passwords match, login successful, we create the session
          createSession(req, res, safeUser);
        } else {
          req.session.toast = toastError({ content: 'Invalid Credentials' });
          res.status(401).redirect('/auth');
        }
      } else {
        req.session.toast = toastError({ content: 'Invalid Credentials' });
        res.status(401).redirect('/auth');
      }

      databaseDisconnect(connection);
    }
  );
});

router.use('/', (req: Request, res: Response) => {
  res.render('login.ejs', {
    toast: toastDispatch(req),
    error: {},
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
  });
});

export default router;
