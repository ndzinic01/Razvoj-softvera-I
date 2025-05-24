// src/app/models/order.model.ts
// models/order.model.ts

export interface Order {
  id?: number; // Ovdje dodajemo id kao opcionalni
  orderDate: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: string;
  myAppUserId: number;
  myAppUser?: any;  // Možeš koristiti pravi tip za korisnika
  orderDetails: Array<{
    productId: number;
    qty: number;
    pricePerUnit: number;
  }>;
}
