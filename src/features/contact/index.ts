import { Router, Response, Request } from "express";

const router = Router();

router.use("/", (req: Request, res: Response) => {
  res.render("contact.ejs", { isLogged: req.session.isLogged });
});

export default router;
