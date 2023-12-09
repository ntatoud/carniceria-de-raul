import { NextFunction, Request, Response } from "express";

export const guestOnlyRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isLogged) {
    next();
  } else {
    res.redirect("/");
  }
};
