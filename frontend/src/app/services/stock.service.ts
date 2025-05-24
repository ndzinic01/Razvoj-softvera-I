// stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MyAuthService} from './auth-services/my-auth.service';
import { Observable, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockService {
  constructor(private http: HttpClient,
              private authService: MyAuthService) {}

  getMedicines() {
    return this.http.get<any[]>('https://localhost:7057/api/GetProductEndpoint');
  }

  /*orderMedicine(medicineId: number) {
    return this.http.post('https://localhost:7057/api/OrderMedicineEndpoint', { medicineId });
  }*/
  /*orderMedicine(medicineId: number) {
    const userId = this.authService.getCurrentUserId();
    if (userId == null) {
      console.error('User nije logovan!');
      return;
    }
    return this.http.post('https://localhost:7057/api/OrderMedicineEndpoint', {
      medicineId: medicineId,
      userId: userId
    });
  }*/


/*orderMedicine(medicineId: number): Observable<any> {
  const userId = this.authService.getCurrentUserId();
  if (userId == null) {
  console.error('User nije logovan!');
  return EMPTY; // vrati prazan observable umjesto undefined
}
return this.http.post('https://localhost:7057/api/OrderMedicineEndpoint', {
  medicineId: medicineId,
  userId: userId
});
}*/
  orderMedicine(medicineId: number, quantity: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (userId == null) {
      console.error('User nije logovan!');
      return EMPTY;
    }

    return this.http.post('https://localhost:7057/api/OrderMedicineEndpoint', {
      medicineId: medicineId,
      userId: userId,
      quantity: quantity
    });
  }
}
