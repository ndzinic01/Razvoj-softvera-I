import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { RegisterRequest } from '../../services/auth-services/dto/register-request';
import { Observable } from 'rxjs';
import {RegisterResponse} from '../../modules/auth/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterEndpointService {
  private apiUrl = `${MyConfig.api_address}/api/AuthRegisterEndpoint/register`;

  constructor(private httpClient: HttpClient) {}

  registerUser(data: RegisterRequest): Observable<RegisterResponse>{
    return this.httpClient.post<RegisterResponse>(this.apiUrl, data);
  }
}
