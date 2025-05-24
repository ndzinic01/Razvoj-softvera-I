import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


// src/app/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}


@Injectable({
  providedIn: 'root',
})
export class SearchService {

  // Direktan URL – zamijeni sa stvarnim URL-om tvoje backend aplikacije
  private apiUrl = 'https://localhost:5077/api/products/search';

  constructor(private http: HttpClient) { }

  searchProducts(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
