import { Component, OnInit } from '@angular/core';
import {NotificationService, Notification} from '../../../services/notification.service';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {MyOrder, OrderDetail, OrderService} from '../../../services/order.service';
import {FullNotification} from '../../../models/notification.model';
import {ChatService, ChatCreateDTO} from '../../../services/chat.service';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: FullNotification[] = [];
  loading = false;
  userId: number | null = null;
  selectedOrder: MyOrder | null = null;
  selectedOrderDetails: OrderDetail[] = [];
  showOrderModal: boolean = false;
  showReplyBox: { [key: number]: boolean } = {};  // Prati koje notifikacije prikazuju input
  replyMessages: { [key: number]: string } = {};  // Čuva sadržaj odgovora

  constructor(private notificationService: NotificationService,
              private authService: MyAuthService,
              private orderService: OrderService,
              private chatService: ChatService) {}


  toggleReplyBox(notificationId: number) {
    this.showReplyBox[notificationId] = !this.showReplyBox[notificationId];
  }

  sendReply(notification: FullNotification) {
    const text = this.replyMessages[notification.id]?.trim();
    if (!text) { return; }

    const receiverId = notification.senderId;
    if (!receiverId) {                 // još jedna sigurnosna provjera
      console.warn('senderId je null – nema kome poslati odgovor');
      return;
    }

    const dto: ChatCreateDTO = {
      senderId: this.userId!,          // prijavljeni farmaceut
      receiverId: receiverId,          // korisnik koji je postavio pitanje
      message: text,
      typeOfMessage: 'response',
      status: 'sent',
      isResponse: true
    };

    this.chatService.sendMessage(dto).subscribe({
      next: () => {
        this.replyMessages[notification.id] = '';
        this.showReplyBox[notification.id] = false;
        this.markAsRead(notification);
      },
      error: err => console.error('Greška pri slanju odgovora:', err)
    });
  }



  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();

    if (this.userId !== null) {
      // Prvo učitaj sve notifikacije iz baze (uključuje i one od korisnika)
      this.loadNotifications(this.userId);

      // Pretplata na promjene - npr. kada korisnik pošalje novu poruku,
      // neka komponenta pozove notifyNotificationsChanged() pa se ovo okida
      this.notificationService.notificationsChanged$.subscribe(() => {
        console.log('Notifikacije su promijenjene. Ponovno učitavanje...');
        this.loadNotifications(this.userId!);
      });
    }
  }


  loadNotifications(userId: number) {
    this.notificationService.getNotifications(userId).subscribe({
      next: (data) => {
        //this.notifications = data;
        this.notifications = data;
        console.log('Učitane notifikacije:', data);
        data.forEach(n => {
          if (n.senderId === null || n.senderId === undefined) {
            console.warn(`Notifikacija ID ${n.id} nema senderId!`);
          }
        });

      },
      error: (err) => {
        console.error('Greška prilikom dohvaćanja notifikacija:', err);
      }
    });
  }

  fetchNotifications() {
    if (this.userId == null) {
      console.error('Ne postoji userId!');
      return;
    }

    this.loading = true;
    this.notificationService.getNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri dohvatu notifikacija', err);
        this.loading = false;
      }
    });
  }

  markAsRead(notification: FullNotification) {
    this.notificationService.markAsRead(notification.id).subscribe();
  }


  deleteNotification(id: number) {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }
    });
  }

  openOrderDetails(notification: FullNotification) {
    if (!notification.order || !notification.orderDetails) return;

    this.selectedOrder = notification.order;
    this.selectedOrderDetails = notification.orderDetails;
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOrder = null;
    this.selectedOrderDetails = [];
  }

}
