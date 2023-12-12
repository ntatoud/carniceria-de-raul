import { Router, Response, Request } from "express";
import { accountUpdate } from "./utils";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);

  accountUpdate(req, res, req.body);
});

router.use("/", (req: Request, res: Response) => {
  res.render("profile.ejs", {
    accountName: req.session.user?.name ?? "Usuario",
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

export default router;
