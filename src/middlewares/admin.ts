import { toastError } from '../components/toast';
import { NextFunction, Request, Response } from 'express';

export const adminOnlyRoute = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.session.isLogged &&
        req.session.user?.authorities === 'ROLE_ADMIN'
    ) {
        next();
    } else {
        req.session.toast = toastError({
            content: 'Access Forbidden | Administrador only',
        });
        res.redirect('/');
    }
};
