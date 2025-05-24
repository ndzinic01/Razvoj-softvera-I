/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
}*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://localhost:5077/api'; // Vaš backend URL

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/your-endpoint`);
  }
}
