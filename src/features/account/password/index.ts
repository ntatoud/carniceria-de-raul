import { Router, urlencoded, Request, Response, NextFunction } from "express";
import { isStrongPassword } from "../../auth/signup/utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/checkPassword", (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? "OK" : problems);
});

router.use("/", (req: Request, res: Response) => {
  res.render("password.ejs", {
    error: {},
    accountName: "Nombre de usuario",
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

export default router;
