import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FullNotification} from '../models/notification.model';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  myAppUserId: number; // <<< ispravno ime
  orderId: number | null;
  type?: string;
  senderId?: number | null;  // Dodaj ovo, nullable jer možda ne postoji za sve notifikacije
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Ovo emitira event kada treba osvježiti notifikacije
  private notificationsChanged = new Subject<void>();

  // Observable koji drugi mogu slušati
  notificationsChanged$ = this.notificationsChanged.asObservable();

  // Metoda koja emitira event da su se notifikacije promijenile
  notifyNotificationsChanged() {
    this.notificationsChanged.next();
  }

  private apiUrl = 'https://localhost:7057/api/GetNotificationEndpoint';

  constructor(private http: HttpClient) {}

 /* getNotifications(myAppUserId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/${myAppUserId}`);
  }*/
  getNotifications(userId: number): Observable<FullNotification[]> {
    return this.http.get<FullNotification[]>(`${this.apiUrl}/${userId}`);
  }

  sendReply(dto: any) {
    return this.http.post('/api/Chat', dto); // DTO mora odgovarati ChatCreateDTO na backendu
  }


  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7057/api/DeleteNotificationEndpoint/${notificationId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`https://localhost:7057/api/PutNotificationEndpoint/${notificationId}/read`, {});
  }


}
