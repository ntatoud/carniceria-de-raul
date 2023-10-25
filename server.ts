import express, {
  Express,
  Request,
  Response,
  urlencoded,
  static as staticSrc,
} from "express";
import auth from "./src/features/auth";
import admin from "./src/features/admin";
import order from "./src/features/order";
import shop from "./src/features/shop";
import about from "./src/features/about";
import contact from "./src/features/contact";
const app: Express = express();

const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(staticSrc("./public"));

app.use(staticSrc("node_modules/bootstrap/dist/"));
app.use(staticSrc("node_modules/bootstrap-icons/font"));
app.set("view engine", "ejs");
app.set("views", [
  "src/features",
  "src/features/auth",
  "src/features/auth/login",
  "src/features/auth/signup",
  "src/features/admin",
  "src/features/admin/users",
  "src/features/admin/products",
  "src/features/order",
  "src/features/order/cart",
  "src/features/order/infos",
  "src/features/order/payment",
  "src/features/shop",
  "src/features/about",
  "src/features/contact",
]);

// Declaration of the routes from the root of the website
app.use("/auth", auth); // Has subroutes
app.use("/admin", admin); // Has subroutes
app.use("/shop", shop); // Has subroutes
app.use("/order", order); // Has subroutes
app.use("/about", about);
app.use("/contact", contact);

app.use("/", (req: Request, res: Response) => {
  res.render("index.ejs");
});

app.get("*", function (req: Request, res: Response) {
  res.status(404);
  res.render("404.ejs");
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
