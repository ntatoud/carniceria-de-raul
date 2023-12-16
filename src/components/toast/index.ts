import { Request } from 'express';

type Toast = {
  isVisible: boolean;
  title: string;
  content: string;
  type: string;
};

export const toastEmpty = (): Toast => {
  return {
    isVisible: false,
    title: '',
    content: '',
    type: 'default',
  };
};

export type ToastParams = { title?: string; content: string };

export const toastSuccess = ({
  title = 'Success',
  content,
}: ToastParams): Toast => {
  return {
    isVisible: true,
    title: title,
    content: content,
    type: 'success',
  };
};

export const toastError = ({
  title = 'Error',
  content,
}: ToastParams): Toast => {
  return {
    isVisible: true,
    title: title,
    content: content,
    type: 'error',
  };
};

export const toastDispatch = (req: Request): Toast => {
  const toast = req.session.toast;
  req.session.toast = toastEmpty();
  return toast as Toast;
};
