import { Authorities } from "@/features/types";
import { NextFunction, Request, Response } from "express";

export const loggedOnlyRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.isLogged && req.session.user?.authorities === "ROLE_USER") {
    next();
  } else {
    res.redirect("/");
  }
};
