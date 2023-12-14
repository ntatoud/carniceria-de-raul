declare type Account = {
  userId: number;
  email: string;
  authorities: Authorities;
  surname?: string;
  name?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  address?: string;
  creationDate?: Date;
};

declare type Product = {
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
declare type CartProduct = Partial<Product> & {
  totalQuantity: number;
  weight: number;
};

declare type Cart = CartProduct[];

declare global {
  declare type Toast = {
    isVisible: boolean;
    title: string;
    content: string;
    type: string;
  };

  declare module 'express-session' {
    interface SessionData {
      user: Account;
      cart: Cart;
    }
    interface Session {
      isLogged?: boolean;
      isPasswordUpdated?: boolean;
      toast: Toast;
    }
  }
}
