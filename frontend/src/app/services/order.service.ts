// admin/services/order.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

// order.service.ts
// u order.service.ts

export interface OrderDetailCreateDTO {
  productId: number;
  qty: number;
  pricePerUnit: number;
}

export interface OrderCreateDTO {
  myAppUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  totalPrice: number;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  // 🔧 Dodaj ovu liniju:
  items: OrderDetailCreateDTO[];
}


export interface MyOrder {
  id?: number;                    // ID narudžbe, nije obavezno za unos
  orderDate: Date;                // Datum narudžbe
  status: string;                 // Status narudžbe (npr. 'Pending', 'Shipped')
  totalPrice: number;             // Ukupna cijena narudžbe
  paymentMethod: string;          // Metod plačanja (npr. 'CreditCard', 'PayPal')
  shippingAddress: string;        // Adresa za dostavu (kombinacija City, Address, PostalCode, Country)
  myAppUserId: number;            // ID korisnika koji je napravio narudžbu
  myAppUser?: any;                // Detalji korisnika (ako su potrebni)
  isSupplyOrder?: boolean;        // Da li je narudžba vezana za opskrbu (ako je specifično za opskrbu)
  cardNumber?: string;            // Broj kartice (ako je plačanje karticom)
  expiryDate?: string;            // Datum isteka kartice
  CVV?: string;                   // CVV kartice
  orderDetails: Array<{
    productId: number;            // ID proizvoda
    qty: number;                  // Količina proizvoda
    pricePerUnit: number;         // Cijena po jedinici proizvoda
  }>;
}

export interface OrderDetail {
  id: number;
  qty: number;
  pricePerUnit: number;
  product: {
    id: number;
    name: string;
  };

}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/GetOrderEndpoint';
  private apiOrderById = '/api/GetOrderByIdEndpoint';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>('https://localhost:7057/api/GetOrderEndpoint');
  }

  getOrderById(id: number): Observable<MyOrder> {
    return this.http.get<MyOrder>(`https://localhost:7057/api/GetOrderByIdEndpoint/${id}`);
  }

  getOrderDetails(orderId: number | undefined): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`https://localhost:7057/api/GetOrderDetailsEndpoint/by-order/${orderId}`);
  }
  private postOrderUrl = 'https://localhost:7057/api/PostOrderEndpoint';

  postOrder(order: OrderCreateDTO): Observable<any> {
    return this.http.post<any>(this.postOrderUrl, order);
  }


  getTrackingStages(): Observable<any[]> {
    return of([
      { title: 'Ordering', description: 'Information about your order' },
      { title: 'User data', description: 'Enter your delivery details' },
      { title: 'Delivery method', description: 'Select delivery method' },
      { title: 'Payment methos', description: 'Select payment method' }
    ]);
  }
  getMyOrders(myAppUserId: number ): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7057/api/GetMyOrdersEndpoint/${myAppUserId}`);
  }
  completeOrder(cartItems: any[], totalAmount: number): Observable<any> {
    console.log('Order completed:', cartItems, totalAmount);
    return of({ status: 'success' });
  }


  updateOrderStatus(orderId: number, newStatus: string) {
    const body = { newStatus };  // šalješ kao objekt, ne samo string
    return this.http.put(`https://localhost:7057/api/UpdateOrderStatusEndpoint/${orderId}`, body, { responseType: 'text' });
  }

}

