import { Router, urlencoded, Request, Response } from 'express';
import { isPasswordCorrect } from '../util';
import { databaseConnect } from '../../../database';
import { QueryError, RowDataPacket } from 'mysql2/promise';
import { User } from '@/features/types';
import { createSession } from './utils';
import { toastDispatch } from '../../../components/toast';

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

                if (isPasswordCorrect(password, userData)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { salt, password, ...safeUser } = userData;

                    // Passwords match, login successful, we create the session
                    createSession(req.session, safeUser);
                    res.status(200).redirect('/');
                } else {
                    res.status(401).render('login.ejs', {
                        error: {
                            state: true,
                            message: 'Invalid Credentials',
                        },
                        isLogged: req.session.isLogged,
                        account: req.session.user,
                    });
                }
            } else {
                res.status(401).render('login.ejs', {
                    error: {
                        state: true,
                        message: 'Invalid Credentials',
                    },
                    isLogged: req.session.isLogged,
                    account: req.session.user,
                });
            }
        }
    );

    connection.end();
});

router.use('/', (req: Request, res: Response) => {
    res.render('login.ejs', {
        toast: toastDispatch(req),
        error: {},
        isLogged: req.session.isLogged,
        account: req.session.user,
    });
});

export default router;
