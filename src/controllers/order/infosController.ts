import { User, UserSession } from '@/types/types.js';
import { Response } from 'express';
import { cartTotalPrice } from '@/controllers/order/cartController.js';

export const addOrderToSession = (
  session: UserSession,
  res: Response,
  orderDetails: Partial<User> &
    Order & { recoveryDay: string; recoveryTime: string },
  userId: number
) => {
  const {
    city,
    postalCode,
    country,
    address,
    phone,
    recoveryDay,
    recoveryTime,
    comment,
    email,
  } = orderDetails;
  const recoveryDate = `${recoveryDay} ${recoveryTime}:00`;
  if (session.user) {
    session.user.city = city;
    session.user.postalCode = postalCode;
    session.user.country = country;
    session.user.address = address;
    session.user.phone = phone ?? session.user.phone;
  }

  session.order = {
    userId,
    recoveryDate,
    comment: comment ?? 'No comments',
    email: email ?? session.user?.email,
    totalPrice: cartTotalPrice(session.cart, true),
    isDone: false,
  };

  res.redirect('/order/payment');
};
