declare module 'express-session' {
  interface SessionData {
    user: Account;
    cart: Cart;
  }
  interface Session {
    isLogged?: boolean;
    isPasswordUpdated?: boolean;
    toast: Toast | string;
  }
}

export {};
