declare module 'express-session' {
  interface SessionData {
    user: Account;
    cart: Cart;
    order: Omit<Order, 'orderId' | 'orderDate'>;
  }
  interface Session {
    isLogged?: boolean;
    isPasswordUpdated?: boolean;
    toast: Toast | string;
  }
}

export {};
