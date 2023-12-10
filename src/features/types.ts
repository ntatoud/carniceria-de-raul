import { Session, SessionData } from 'express-session';
export type User = {
    userId: number;
    email: string;
    password: string;
    salt: string;
    authorities: Authorities;
    name?: string;
    surname?: string;
    phone?: string;

    address?: string;
    city?: string;
    postalCode?: string;
    country: string;

    creationDate?: Date;
};

export type Product = {
    productId: number;
    name: string;
    price: number;
    stock: number;
    sale: boolean;
    salePrice?: number;
    best: boolean;
    image: string;
    description: string;
    category: string;
};

export type Order = {
    orderId: number;
    userId: number;
    orderDate: Date;
    recoveryDate: Date;
    totalPrice?: number;
    comment?: string;
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
