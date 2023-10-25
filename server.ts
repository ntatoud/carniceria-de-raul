import express, {
  Express,
  Request,
  Response,
  urlencoded,
  static as staticSrc,
} from "express";
import login from "./src/features/login";
import admin from "./src/features/admin";
import order from "./src/features/order/cart";
import cart from "./src/features/order";
const app: Express = express();

const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(staticSrc("./public"));

app.use(staticSrc("node_modules/bootstrap/dist/"));
app.set("view engine", "ejs");
app.set("views", [
  "src/features",
  "src/features/login",
  "src/features/admin",
  "src/features/order",
  "src/features/order/cart",
]);
app.use("/login", login);
app.use("/admin", admin);
app.use("/order", order);

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
