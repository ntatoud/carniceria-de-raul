import { Router, Response, Request } from "express";

const router = Router();

router.use("/", (req: Request, res: Response) => {
  res.render("contact.ejs", {
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

export default router;
