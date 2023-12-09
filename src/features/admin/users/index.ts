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
  res.render("userCreate.ejs", { user: undefined });
});

router.use("/update/:id", (req: Request, res: Response) => {
  getUserToUpdate(res, req.params.id);
});

router.use("/", (req: Request, res: Response) => {
  getUserList(res);
});

export default router;
