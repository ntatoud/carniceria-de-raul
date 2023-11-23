import { databaseConnect } from "../../database";
import { Router, Response, Request } from "express";

const router = Router();
router.use("/", (req: Request, res: Response) => {
  res.render("shop.ejs", {
    categories: ["Ternera", "Pollo", "Elaborados", "Cerdo"],
  });
});

export default router;
