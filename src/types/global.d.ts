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
  unit: '€/kg' | '€/unidad';
  description: string;
  category: string;
};
declare type CartProduct = Product & {
  totalQuantity: number;
  totalPrice: number;
  totalSalePrice?: number;
  weight: number;
};

declare type Cart = CartProduct[];

declare type Toast = {
  isVisible: boolean;
  title: string;
  content: string;
  type: string;
};

declare type Order = {
  orderId: number;
  userId: number;
  orderDate: Date | string;
  recoveryDate: Date | string;
  email?: string;
  totalPrice?: number;
  comment?: string;
  isDone: boolean;
};
