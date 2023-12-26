import express, { Request, Response, static as staticSrc } from 'express';
import i18next from '@/lib/i18n/config.js';
import i18nextMiddleware from 'i18next-http-middleware';
import session from '@/lib/session/config.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import auth from '@/features/auth/index.js';
import admin from '@/features/admin/index.js';
import order from '@/features/order/index.js';
import shop from '@/features/shop/index.js';
import about from '@/features/about/index.js';
import contact from '@/features/contact/index.js';
import account from '@/features/account/index.js';
import { toastDispatch } from '@/components/toast/index.js';
import { AVAILABLE_LANGUAGES } from '@/lib/i18n/constants.js';

import dotenv from 'dotenv';
import { explicitLog } from '@/functions/index.js';

dotenv.config();

export const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session);
app.use(i18nextMiddleware.handle(i18next));

app.use(staticSrc('public'));
app.use(staticSrc('dist/src'));
app.use(staticSrc('node_modules/bootstrap/dist/'));
app.use(staticSrc('node_modules/@popperjs/core/dist/umd'));
app.use(staticSrc('node_modules/jquery/dist/'));
app.use(staticSrc('node_modules/bootstrap-icons/font'));

app.set('view engine', 'ejs');

app.set('views', [
  'src/features',
  'src/features/auth',
  'src/features/auth/login',
  'src/features/auth/signup',
  'src/features/auth/reset',
  'src/features/admin',
  'src/features/admin/products',
  'src/features/admin/users',
  'src/features/admin/orders',
  'src/features/order',
  'src/features/order/cart',
  'src/features/order/infos',
  'src/features/order/payment',
  'src/features/shop',
  'src/features/shop/_partials',
  'src/features/layout',
  'src/features/about',
  'src/features/contact',
  'src/features/account',
  'src/features/account/profile',
  'src/features/account/password',
]);

// Declaration of the routes from the root of the website
app.use('/auth', auth); // Has subroutes
app.use('/admin', admin); // Has subroutes
app.use('/shop', shop); // Has subroutes
app.use('/order', order); // Has subroutes
app.use('/about', about);
app.use('/contact', contact);
app.use('/account', account); // Has subroutes

app.post('/lang', (req: Request, res: Response) => {
  const langKey = req.body.langKey;
  i18next.changeLanguage(langKey);
  const language = AVAILABLE_LANGUAGES.find(({ key }) => key === langKey);
  res.status(200).send(language);
});

app.get('/cookies', (req: Request, res: Response) => {
  if (req.cookies.cart !== undefined) {
    req.areCookiesAllowed = true;
  }
  res.status(200).send({ areCookiesAllowed: req.areCookiesAllowed });
});

app.post('/cookies', (req: Request, res: Response) => {
  const allowCookies = req.body.areAllowed;
  if (allowCookies === 'true') {
    req.areCookiesAllowed = true;
    res.cookie('cart', [] as Cart, {
      expires: new Date(Date.now() + 90000),
      httpOnly: true,
    });

    res.send({ areCookiesAllowed: true });
  } else {
    req.areCookiesAllowed = false;

    res.send({ areCookiesAllowed: false });
  }
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.setHeader('Content-Type:', 'application/xml');
  res.sendFile('sitemap.xml');
});
app.get('/', (req: Request, res: Response) => {
  const { isLogged, user, cart } = req.session;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  res.render('index.ejs', {
    isLogged: isLogged,
    account: user,
    toast: toastDispatch(req),
    cart: isLogged ? cart : req.cookies.cart,
    t: i18next.t,
  });
});

app.get('*', (req: Request, res: Response) => {
  res.status(404);
  res.render('404.ejs');
});

app.listen(port, () => {
  explicitLog(`Now listening on port ${port}`);
  explicitLog(
    `Logs are currently in mode ${
      process.env.LOG_DETAILS === 'quiet'
        ? "'quiet'. Set LOG_DETAILS to 'verbose' to display full log details."
        : 'verbose'
    }`
  );
});
