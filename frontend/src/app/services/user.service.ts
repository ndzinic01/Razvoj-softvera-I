import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export interface MyAppUserDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  // dodaj još po potrebi
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'https://localhost:7057/api'; // prilagodi URL po potrebi

  constructor(private http: HttpClient) { }

// user.service.ts
  getPharmacists(): Observable<MyAppUserDTO[]> {
    return this.http.get<MyAppUserDTO[]>('https://localhost:7057/api/GetMyAppUserEndpoint/pharmacist');
  }

  getPharmacistProfile() {
    return this.http.get<any>('https://localhost:7057/api/GetMyAppUserEndpoint/pharmacist/dashboard');
  }


}
