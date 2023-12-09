declare global {
  type User = {
    id: number;
    email: string;
    password: string;
    salt: string;
    authorities: Authorities;
    name?: string;
    surname?: string;
    address?: string;
    creationDate?: Date;
    phoneNumber?: string;
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
