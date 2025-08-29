export interface CartItem {
  id?: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at?: string;
}