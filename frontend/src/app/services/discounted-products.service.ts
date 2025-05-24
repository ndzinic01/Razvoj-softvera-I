import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DiscountedProduct {
  id: number;
  name: string;
  picture: string;
  price: number;
  discountedPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountedProductsService {
  private apiUrl = 'http://localhost:5077/api/products/discounted'; // URL API za snižene proizvode

  constructor(private http: HttpClient) {}

  // Funkcija za dobijanje sniženih proizvoda
  getDiscountedProducts(): Observable<DiscountedProduct[]> {
    return this.http.get<DiscountedProduct[]>(this.apiUrl);
  }
}

