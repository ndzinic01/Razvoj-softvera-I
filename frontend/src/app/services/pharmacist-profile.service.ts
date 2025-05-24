import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
export interface PharmacistProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  employmentDate: string;
  profileImageUrl?: string; // Ako je opcionalno
}

@Injectable({
  providedIn: 'root'
})
export class PharmacistProfileService {
  constructor(private http: HttpClient) {}

  /*getProfile(username: string) {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`https://localhost:7057/api/GetMyAppUserEndpoint/pharmacist/dashboard`);
  }*/
  /*getProfile(username: string): Observable<PharmacistProfile> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<PharmacistProfile>(`https://localhost:7057/api/GetMyAppUserEndpoint/pharmacist/dashboard`, { headers });
  }*/
  getProfile(username: string): Observable<PharmacistProfile> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<PharmacistProfile>(`https://localhost:7057/api/GetMyAppUserEndpoint/pharmacist/dashboard`, { headers })
      .pipe(
        tap(data => {
          console.log('Response from backend:', data);  // Logujte odgovor
        })
      );
  }


  updateProfile(data: any) {
    const token = localStorage.getItem('authToken');  // Pretpostavljamo da je token sačuvan u localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Dodaj JWT token u Authorization header
    });

    return this.http.put(`https://localhost:7057/update-profile`, data, { headers });
  }


  changePassword(data: any): Observable<any> {
    return this.http.post('https://localhost:7057/api/account/change-password', data);
  }

}
