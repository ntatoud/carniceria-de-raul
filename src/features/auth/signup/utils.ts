import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import { User } from '@/features/types.js';
import { generateSaltHashedPassword } from '@/features/auth/util.js';
import { QueryError, RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import { toastSuccess } from '@/components/toast/index.js';

export const isStrongPassword = (
  password: string
): { isStrong: boolean; problems: string[] } => {
  let isStrong = true;
  const problems: string[] = [];
  if (password.length < 8) {
    isStrong = false;
    problems.push('Be at least 8 characters long');
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    isStrong = false;
    problems.push('Contain at least 1 Uppercase letter');
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    isStrong = false;
    problems.push('Contain at least 1 Lowercase letter');
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    isStrong = false;
    problems.push('Contain at least 1 digit');
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    isStrong = false;
    problems.push('Contain at least 1 Special character');
  }
  return { isStrong, problems };
};

export const checkEmailTaken = (res: Response, email: string) => {
  const connection = databaseConnect();
  const checkEmailTakenQuery = 'SELECT * FROM users WHERE email = ?';

  connection.execute(
    checkEmailTakenQuery,
    [email],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) res.status(502).send(error);

      if (result.length) {
        res.status(200).send('NOK');
      } else {
        res.status(200).send('OK');
      }

      databaseDisconnect(connection);
    }
  );
};

export const registerIfPossible = (
  req: Request,
  res: Response,
  credentials: User
) => {
  const { name, surname, email, password } = credentials;

  const connection = databaseConnect();
  const checkEmailTakenQuery = 'SELECT * FROM users WHERE email = ?';
  const registerQuery = `
    INSERT INTO users (name, surname, email, password, salt)
    VALUES (?, ?, ?, ?, ?);
  `;
  connection.execute(
    checkEmailTakenQuery,
    [email],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error)
        res.status(502).render('signup.ejs', {
          error: { state: true, message: error.message },
        });

      if (result.length)
        res.render('signup.ejs', {
          error: {
            state: true,
            message: 'An account already exists with this email.',
          },
          isLogged: req.session.isLogged,
          cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
        });
      else if (!isStrongPassword(password).isStrong)
        res.render('signup.ejs', {
          error: {
            state: true,
            message: 'Your password is too weak',
            isLogged: req.session.isLogged,
            account: req.session.user,
            cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
          },
        });
      else {
        const { salt, hashPwd } = generateSaltHashedPassword(password);
        connection.execute(
          registerQuery,
          [name, surname, email, hashPwd, salt],
          (error: QueryError | null) => {
            if (error)
              res.status(502).render('signup.ejs', {
                error: { state: true, message: error.message },
              });

            req.session.toast = toastSuccess({
              content: 'Account created successfuly',
            });
            res.status(200).redirect('/auth/login');

            databaseDisconnect(connection);
          }
        );
      }
    }
  );
};
