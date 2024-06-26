export interface Product {
  id: number;
  imgPath: string[];
  name: string;
  description: string;
  price: number;
  category: string;
  size: string[];
  fabric: string;
  color: string;
  collection?: string;
}
// Наследую все свойства от Product, но тип size изменяю и добавляю count
export interface OrderProduct extends Omit<Product, "size"> {
  size: string;
  count: number;
}
export interface User {
  id: string | number;
  role: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  wishlist: Product[];
  orders: OrderProduct[];
}
export interface RootState {
  user: {
    user: {
      id: string;
      role: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      wishlist: Product[];
      orders: OrderProduct[];
    };
  };
}
