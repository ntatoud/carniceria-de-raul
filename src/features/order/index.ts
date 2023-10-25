import { Request, Response, Router } from "express";
import cart from "./cart";
const router = Router();

router.use("/cart", cart);

router.use("/", (req: Request, res: Response) => {
  res.render("order.ejs");
});

export default router;
