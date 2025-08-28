
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  COURIER = 'courier'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string;
}

export interface Meal {
  id:string;
  categoryId: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  priceSAR: number;
  // FIX: Add 'high-protein' to the allowed tags union type to match mock data.
  tags?: ('vegan' | 'keto' | 'gluten-free' | 'high-protein')[];
}

export interface SubscriptionPlan {
  id: string;
  name_ar: string;
  name_en: string;
  type: 'weekly' | 'monthly' | 'yearly';
  description_ar: string;
  description_en: string;
  basePriceSAR: number;
  mealsPerDay: number;
  daysPerWeek: number;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface DailyMealSelection {
    day: number;
    meals: { meal: Meal; quantity: number }[];
}

export interface SubscriptionCartItem {
  plan: SubscriptionPlan;
  customization: {
    mealsPerDay: number;
    daysPerWeek: number;
  };
  totalPrice: number;
  selectedMeals: DailyMealSelection[];
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  subscription?: SubscriptionCartItem; // An order can contain a subscription purchase
  total: number;
}

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  nextRenewalDate: string;
  selectedMeals: DailyMealSelection[];
}