import { Router, Response, Request } from "express";

const router = Router();

router.use("/", (req: Request, res: Response) => {
  res.render("profile.ejs",{
    accountName: "Nombre de usuario",
  });
});

export default router;
