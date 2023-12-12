import { NextFunction, Request, Response } from "express";

export const adminOnlyRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.isLogged && req.session.user?.authorities === "ROLE_ADMIN") {
    next();
  } else {
    res.redirect("/");
  }
};
