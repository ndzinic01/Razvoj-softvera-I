import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Advertisement {
  id: number;
  title: string;
  imageURL: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private apiUrl = 'https://localhost:5077/api/GetAdvertisement'; // API URL

  constructor(private http: HttpClient) {}

  getAdvertisements(): Observable<Advertisement[]> {
    return this.http.get<Advertisement[]>(this.apiUrl);
  }
}

