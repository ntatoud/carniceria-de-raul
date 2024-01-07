import { Session, SessionData } from 'express-session';

export type User = Account & {
  password: string;
  salt: string;
};

export type Category = {
  categoryId: number;
  name: string;
};

export enum Authorities {
  'ROLE_ADMIN',
  'ROLE_USER',
}

export type UserSession = Session & Partial<SessionData>;
