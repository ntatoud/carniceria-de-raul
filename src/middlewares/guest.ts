import { toastError } from '../components/toast';
import { NextFunction, Request, Response } from 'express';

export const guestOnlyRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isLogged) {
    next();
  } else {
    req.session.toast = toastError({ content: 'Access Forbidden' });
    res.redirect('/');
  }
};
