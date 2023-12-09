import { Request, Response, Router, urlencoded } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  res.render("payment.ejs", {
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});

export default router;
