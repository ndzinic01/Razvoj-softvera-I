import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

interface NewInProduct {
  id: number;
  name: string;
  picture: string;
  price: number;
  dateAdded: string; // može biti i Date ako želiš formatiranje
}

@Injectable({
  providedIn: 'root'
})
export class NewInProductsService {
  private apiUrl = 'http://localhost:5077/api/products/newInProducts';

  constructor(private http: HttpClient) {}

  getLatestProducts(): Observable<NewInProduct[]> {
    return this.http.get<NewInProduct[]>(this.apiUrl);
  }
}
