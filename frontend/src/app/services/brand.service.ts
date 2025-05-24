import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  picture: string;
  categoryId: number;
  brandId: number;
  isDiscounted: boolean;
  discountPercentage: number | null;
  discountedPrice: number;
  datumDodavanja: Date;
}

@Injectable({
  providedIn: 'root'
})


export class BrandService {


  constructor(private http: HttpClient) {
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7057/api/products/brands/products/brands');
  }

  getBrandById(id: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7057/api/brands/${id}`);
  }


  private baseUrl: string = 'http://localhost:5077/api'; // Promijenite URL prema vašoj backend adresi

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/brand/${brandId}`);
  }
}
