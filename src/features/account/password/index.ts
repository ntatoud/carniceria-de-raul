import { Router, urlencoded, Request, Response, NextFunction } from "express";
import { isStrongPassword } from "../../auth/signup/utils";
import { passwordUpdateIfOldPasswordCorrect } from "./utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/checkPassword", (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? "OK" : problems);
});

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  passwordUpdateIfOldPasswordCorrect(req, res, {
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  });
});

router.use("/", (req: Request, res: Response) => {
  res.render("password.ejs", {
    error: {},
    accountName: req.session.user?.name ?? "Usuario",
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

export default router;
