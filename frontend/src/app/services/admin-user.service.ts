import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MyAppUser {
  id: number;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isPharmacist: boolean;
  isCustomer: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = 'https://localhost:7057/api/GetMyAppUserEndpoint'; // prilagodi ako treba

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<MyAppUser[]> {
    return this.http.get<MyAppUser[]>(this.apiUrl);
  }
  updateUser(user: MyAppUser): Observable<void> {
    console.log('Payload koji šaljem:', user);
    return this.http.put<void>(`https://localhost:7057/api/PutMyAppUserEndpoint/PutMyAppUserEndpoint/${user.id}`, user);
  }
  getUserById(id: number): Observable<MyAppUser> {
    return this.http.get<MyAppUser>(`https://localhost:7057/api/GetMyAppUserByIdEndpoint/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7057/api/DeleteMyAppUserEndpoint/${id}`);
  }

}
