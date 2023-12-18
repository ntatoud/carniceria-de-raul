import { databaseConnect } from '../../../database/index.js';
import { generateSaltHashedPassword } from '../../../features/auth/util.js';
import { toastSuccess } from '../../../components/toast/index.js';
export const isStrongPassword = (password) => {
    let isStrong = true;
    const problems = [];
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
export const checkEmailTaken = (res, email) => {
    const connection = databaseConnect();
    const checkEmailTakenQuery = 'SELECT * FROM users WHERE email = ?';
    connection.execute(checkEmailTakenQuery, [email], (error, result) => {
        if (error)
            res.status(502).send(error);
        if (result.length) {
            res.status(200).send('NOK');
        }
        else {
            res.status(200).send('OK');
        }
        connection.end();
    });
};
export const registerIfPossible = (session, res, credentials) => {
    const { name, surname, email, password } = credentials;
    const connection = databaseConnect();
    const checkEmailTakenQuery = 'SELECT * FROM users WHERE email = ?';
    const registerQuery = `
    INSERT INTO users (name, surname, email, password, salt)
    VALUES (?, ?, ?, ?, ?);
  `;
    connection.execute(checkEmailTakenQuery, [email], (error, result) => {
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
                isLogged: session.isLogged,
                cart: session.cart,
            });
        else if (!isStrongPassword(password).isStrong)
            res.render('signup.ejs', {
                error: {
                    state: true,
                    message: 'Your password is too weak',
                    isLogged: session.isLogged,
                    account: session.user,
                    cart: session.cart,
                },
            });
        else {
            const { salt, hashPwd } = generateSaltHashedPassword(password);
            connection.execute(registerQuery, [name, surname, email, hashPwd, salt], (error) => {
                if (error)
                    res.status(502).render('signup.ejs', {
                        error: { state: true, message: error.message },
                    });
                session.toast = toastSuccess({
                    content: 'Account created successfuly',
                });
                res.status(200).redirect('/auth/login');
                connection.end();
            });
        }
    });
};
