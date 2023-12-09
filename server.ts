import express, {
  Express,
  Request,
  Response,
  static as staticSrc,
} from "express";
import bodyParser from "body-parser";
import session from "express-session";
import auth from "./src/features/auth";
import admin from "./src/features/admin";
import order from "./src/features/order";
import shop from "./src/features/shop";
import about from "./src/features/about";
import contact from "./src/features/contact";
import account from "./src/features/account";

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(staticSrc("public"));
app.use(staticSrc("dist/src"));
app.use(staticSrc("node_modules/bootstrap/dist/"));
app.use(staticSrc("node_modules/@popperjs/core/dist/umd"));
app.use(staticSrc("node_modules/jquery/dist/"));
app.use(staticSrc("node_modules/bootstrap-icons/font"));

app.use(
  session({
    secret: "email", //used to sign the session ID cookie
    name: "login", // (optional) name of the session cookie
    resave: true, // forces the session to be saved back to the session store
    saveUninitialized: true, // forces a session an uninitialized session to be saved to the store
  })
);

app.set("view engine", "ejs");

app.set("views", [
  "src/features",
  "src/features/auth",
  "src/features/auth/login",
  "src/features/auth/signup",
  "src/features/auth/reset",
  "src/features/admin",
  "src/features/admin/products",
  "src/features/admin/users",
  "src/features/admin/orders",
  "src/features/order",
  "src/features/order/cart",
  "src/features/order/infos",
  "src/features/order/payment",
  "src/features/shop",
  "src/features/shop/_partials",
  "src/features/layout",
  "src/features/about",
  "src/features/contact",
  "src/features/account",
  "src/features/account/profile",
  "src/features/account/password",
]);

// Declaration of the routes from the root of the website
app.use("/auth", auth); // Has subroutes
app.use("/admin", admin); // Has subroutes
app.use("/shop", shop); // Has subroutes
app.use("/order", order); // Has subroutes
app.use("/about", about);
app.use("/contact", contact);
app.use("/account", account); // Has subroutes

app.use("/", (req: Request, res: Response) => {
  const { isLogged, hasJustLogged, user } = req.session;
  req.session.hasJustLogged = false;
  res.render("index.ejs", {
    isLogged: isLogged,
    hasJustLogged: hasJustLogged,
    user: user,
  });
});

app.get("*", (req: Request, res: Response) => {
  res.status(404);
  res.render("404.ejs");
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
