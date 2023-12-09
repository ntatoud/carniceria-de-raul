declare global {
  type User = {
    id: number;
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
  declare module "express-session" {
    interface SessionData {
      user: Partial<User>;
    }
    interface Session {
      isLogged?: boolean;
      hasJustLogged?: boolean;
    }
  }
}
