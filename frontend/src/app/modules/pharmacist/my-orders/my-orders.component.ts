import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})

export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userId: number = 0; // Dodano polje za userId

  constructor(private orderService: OrderService,
              private myAuthService: MyAuthService) {}

  ngOnInit(): void {
    const userId = this.myAuthService.getCurrentUserId();
    if (userId !== null) {
      this.loadOrders(userId);
    }
  }

  getUserId(): number {
    // Ovdje uzmi userId - recimo iz localStorage
    const userIdString = localStorage.getItem('userId');
    return userIdString ? Number(userIdString) : 0;
  }

  loadOrders(userId: number): void {
    this.orderService.getMyOrders(userId).subscribe({
      next: (data) => {
        this.orders = data; // nema filtera!
      },
      error: (err) => {
        console.error('Greška prilikom dohvaćanja narudžbi:', err);
      }
    });
  }

}



