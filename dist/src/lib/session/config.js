import session from 'express-session';
export default session({
    secret: 'email',
    name: 'login',
    resave: true,
    saveUninitialized: true, // forces a session an uninitialized session to be saved to the store
});
