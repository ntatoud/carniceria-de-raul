import { Router, Response, Request } from "express";

const router = Router();

router.use("/", (req: Request, res: Response) => {
  res.render("contact.ejs");
});

export default router;
