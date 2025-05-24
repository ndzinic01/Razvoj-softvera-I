import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishList: any[] = [];
  private wishListCount = new BehaviorSubject<number>(0);
  wishListCount$ = this.wishListCount.asObservable();

  constructor() { }

  getWishList() {
    return this.wishList;
  }

  addToWishList(product: any) {
    const existingProduct = this.wishList.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.wishList.push({ ...product, quantity: 1 });
    }
    this.updateWishList();
  }

  removeFromWishList(productId: number) {
    this.wishList = this.wishList.filter(p => p.id !== productId);
    this.updateWishList();
  }
  isProductInWishList(productId: number): boolean {
    return this.wishList.some(p => p.id === productId);
  }
  private updateWishList() {
    this.wishListCount.next(this.wishList.length);
    localStorage.setItem('wishList', JSON.stringify(this.wishList));
  }
  clearWishList() {
    this.wishList = [];
    this.wishListCount.next(0);
  }
}
