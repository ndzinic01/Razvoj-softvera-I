import { Component, OnInit } from '@angular/core';
import { MyOrder, OrderService} from '../../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-order',
  standalone: false,
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.css']
})
export class CustomerOrderComponent implements OnInit {
  orders:  MyOrder[] = [];
  selectedStatus: { [orderId: number]: string } = {};

  availableStatuses: string[] = ['Received', 'Processing', 'Shipped', 'Delivered'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        // Samo narudžbe kupaca, ne restock
        this.orders = data
          .filter(order => !order.isSupplyOrder)
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      },
      error: (error) => {
        console.error('Greška pri učitavanju narudžbi', error);
      }
    });
  }

  changeOrderStatus(orderId: number) {
    const newStatus = this.selectedStatus[orderId];

    if (!newStatus) {
      this.snackBar.open('Molimo izaberite novi status.', 'Zatvori', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Status uspješno ažuriran.', 'Zatvori', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.loadOrders(); // Reload nakon izmjene
      },
      error: (error) => {
        console.error('Greška pri ažuriranju statusa', error);
        this.snackBar.open('Greška pri ažuriranju statusa.', 'Zatvori', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }
}
