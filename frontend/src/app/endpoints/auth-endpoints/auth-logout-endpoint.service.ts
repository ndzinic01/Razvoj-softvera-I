/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthLogoutEndpointService {

  constructor() { }
}*/
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MyConfig} from '../../my-config';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthLogoutEndpointService implements MyBaseEndpointAsync<void, void> {
  private apiUrl = `${MyConfig.api_address}/auth/logout`;

  constructor(private httpClient: HttpClient, private authService: MyAuthService, private router: Router ){
}

handleAsync() {
  return new Observable<void>((observer) => {
    this.httpClient.post<void>(this.apiUrl, {}).subscribe({
      next: () => {
        // Nakon uspješnog odgovora sa servera, uklonite token na klijentu
        this.authService.setLoggedInUser(null); // Uklanja token iz localStorage
        this.router.navigate(['/auth/login']); // redirect nakon logouta
        observer.next();
        observer.complete();
      },
      error: (error) => {
        console.error('Error during logout:', error);
        this.authService.setLoggedInUser(null);
        this.router.navigate(['/auth/login']);
        observer.error(error);

      }
    });
  });
}
}
