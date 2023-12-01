export type User = {
  id: number;
  email: string;
  password: string;
  authorities: Authorities;
  name?: string;
  surname?: string;
  address?: string;
  creationDate?: Date;
  phoneNumber?: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  sale: Boolean;
  salePrice?: number;
  best: boolean;
  image: string;
  description: string;
  category: string;
};

export type Order = {
  id: number;
  userId: number;
  orderDate: Date;
  recoveryDate: Date;
  totalPrice?: number;
  comment?: string;
};

export type Category = {
  id: number;
  name: string;
};

export enum Authorities {
  ROLE_ADMIN,
  ROLE_USER,
}
