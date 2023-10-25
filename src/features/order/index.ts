import { Request, Response, Router } from "express";
import cart from "./cart";
import infos from "./infos";
import payment from "./payment";

const router = Router();

router.use("/cart", cart);
router.use("/infos", infos);
router.use("/payment", payment);

router.use("/", (req: Request, res: Response) => {
  res.redirect("/order/cart");
});

export default router;
