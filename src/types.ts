export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isBestSeller?: boolean;
  isAvailable?: boolean;
}

export interface CartItem {
  id: number;
  foodItem: FoodItem;
  quantity: number;
}

export interface Address {
  id: number;
  userId: string;
  name: string;
  phone: string;
  area: string;
  city: string;
  landmark?: string;
  district: string;
  zipcode: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
  priceAtPurchase: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleNumber: string;
  vehicleType: string;
  photo: string;
  totalDeliveries: number;
}

export type OrderStatus = 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  address: Address;
  paymentMethod: 'cod' | 'online';
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  deliveryPartner?: DeliveryPartner;
  statusTimeline: { status: OrderStatus; time: string; }[];
}

export type PageView =
  | 'menu'
  | 'cart'
  | 'address'
  | 'checkout'
  | 'orders'
  | 'order-success'
  | 'order-tracking'
  | 'login'
  | 'profile'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-food'
  | 'admin-orders'
  | 'admin-users';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}
