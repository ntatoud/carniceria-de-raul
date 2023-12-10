declare global {
  type User = {
    userId: number;
    email: string;
    password: string;
    salt: string;
    authorities: Authorities;
    surname?: string;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country: string;
    address?: string;
    creationDate?: Date;
  };
  type Toast = {
    isVisible: boolean;
    title: string;
    content: string;
    type: string;
  };
  declare module "express-session" {
    interface SessionData {
      user: Partial<User>;
    }
    interface Session {
      isLogged?: boolean;
      hasJustLogged?: boolean;
      isPasswordUpdated?: boolean;
      successToast: Toast;
      errorToast: Toast;
    }
  }
}
