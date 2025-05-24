import { Component, OnInit } from '@angular/core';
import { MyOrder, OrderDetail, OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: MyOrder[] = [];
  selectedOrder: MyOrder | null = null;
  orderDetails: OrderDetail[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data;
    });
  }


  showDetails(order: MyOrder): void {
    if (order.id !== undefined) {  // Provjera da id nije undefined
      this.orderService.getOrderById(order.id).subscribe((data) => {
        this.selectedOrder = data;
        console.log(this.selectedOrder);  // Proveri da li 'shippingAddress' postoji
        this.orderService.getOrderDetails(order.id).subscribe((details) => {
          this.orderDetails = details;
        });
      });
    } else {
      console.error('Order ID is undefined');
      // Dodajte neki kod za grešku ako je ID undefined
    }
  }

  closeDetails(): void {
    this.selectedOrder = null;
    this.orderDetails = [];
  }

  changeStatus(order: MyOrder, event: any): void {
    const newStatus = event.target.value;
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe({
      next: () => {
        order.status = newStatus;  // Ažuriraj lokalno odmah
        console.log('Status uspješno promijenjen.');
      },
      error: (error) => {
        console.error('Greška prilikom mijenjanja statusa:', error);
      }
    });
  }
}

