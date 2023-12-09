import { Router, urlencoded, Request, Response } from "express";
import {
  userDelete,
  getUserList,
  getUserToUpdate,
  userCreate,
  userUpdate,
} from "./utils";
const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/delete/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  userDelete(res, userId);
});

router.post("/create", (req: Request, res: Response) => {
  userCreate(res, req.body);
});

router.post("/update/:id", (req: Request, res: Response) => {
  userUpdate(res, req.body, req.params.id);
});

router.use("/create", (req: Request, res: Response) => {
  res.render("userCreate.ejs", {
    user: undefined,
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});

router.use("/update/:id", (req: Request, res: Response) => {
  getUserToUpdate(req, res, req.params.id);
});

router.use("/", (req: Request, res: Response) => {
  getUserList(req, res);
});

export default router;
