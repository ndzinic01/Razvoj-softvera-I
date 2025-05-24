import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  private cartApiUrl = 'https://localhost:7057/api/PostAddToCartEndpoint';
  constructor(private http: HttpClient) {}

  getCart(): any[] {
    return this.cartItems;
  }
  // Funkcija za povlačenje proizvoda u korpi
  /*getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.cartApiUrl);
  }*/
  addToCart(item: any): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;

      window.alert(`Proizvod "${existingItem.name}" je već u korpi. Količina je povećana na ${existingItem.quantity}.`);
    } else {
      this.cartItems.push({
        ...item,
        quantity: item.quantity || 1
      });
    }

    this.updateCartCount();
  }

  private updateCartCount(): void {
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(totalItems);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  private cartKey: string = 'cart'; // Ključ za košaricu u localStorage
  private userIdKey: string = 'userId'; // Ključ za ID korisnika u localStorage

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  clearCart() {
    this.cartItems = [];  // Očisti košaricu
  }


  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.cartApiUrl);
  }
}
