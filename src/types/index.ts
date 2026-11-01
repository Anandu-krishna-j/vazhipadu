export interface Temple {
  id: string;
  name: string;
  location: string;
  deity: string;
  description: string;
}

export interface Offering {
  id: string;
  templeId: string;
  name: string;
  price: number;
  active: boolean;
  description?: string;
  category?: 'Abhishekam' | 'Archana' | 'Prasadam' | 'Special' | 'Daily';
}

export interface OrderItem {
  offeringId: string;
  offeringName: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Order {
  id: string;
  templeId: string;
  templeName: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string; // YYYY-MM-DD
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO string
}

export interface CreateOrderRequest {
  templeId: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string; // YYYY-MM-DD
  items: {
    offeringId: string;
    quantity: number;
  }[];
}

export interface GetOrdersQuery {
  date?: string;
  status?: OrderStatus | 'ALL';
  phoneNumber?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CartItem {
  offering: Offering;
  quantity: number;
}

export const NAKSHATRAS = [
  'Ashwini (Aswathy)',
  'Bharani',
  'Krittika (Karthika)',
  'Rohini',
  'Mrigashirsha (Makayiram)',
  'Ardra (Thiruvathira)',
  'Punarvasu (Punartham)',
  'Pushya (Pooyam)',
  'Ashlesha (Ayilyam)',
  'Magha (Makam)',
  'Purva Phalguni (Pooram)',
  'Uttara Phalguni (Uthram)',
  'Hasta (Atham)',
  'Chitra (Chithira)',
  'Swati (Chothi)',
  'Vishakha (Visakam)',
  'Anuradha (Anizham)',
  'Jyeshtha (Thrikketta)',
  'Mula (Moolam)',
  'Purva Ashadha (Pooradam)',
  'Uttara Ashadha (Uthradam)',
  'Shravana (Thiruvonam)',
  'Dhanishta (Avittom)',
  'Shatabhisha (Chathayam)',
  'Purva Bhadrapada (Poororuttathi)',
  'Uttara Bhadrapada (Uthrattathi)',
  'Revati (Revathi)',
] as const;

export type Nakshatra = (typeof NAKSHATRAS)[number];
