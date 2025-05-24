import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description?: string;  // Opcionalno polje, možeš dodati prema potrebama
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5077/api/getCategory';  // Endpoint za kategorije

  constructor(private http: HttpClient) {}

  // Metoda za dobivanje kategorija
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
