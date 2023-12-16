import session from 'express-session';

export default session({
  secret: 'email', //used to sign the session ID cookie
  name: 'login', // (optional) name of the session cookie
  resave: true, // forces the session to be saved back to the session store
  saveUninitialized: true, // forces a session an uninitialized session to be saved to the store
});
