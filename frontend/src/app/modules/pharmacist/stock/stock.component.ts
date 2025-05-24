import {Component, OnInit} from '@angular/core';
import {StockService} from '../../../services/stock.service';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
  medicines: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.stockService.getMedicines().subscribe(data => {
      this.medicines = data;
    });
  }

  /*orderMedicine(medicineId: number): void {
    this.stockService.orderMedicine(medicineId).subscribe({
      next: () => {
        alert('Narudžba za lijek uspješno kreirana!');
        this.loadMedicines();
      },
      error: (error) => {
        console.error('Greška prilikom narudžbe:', error);
        alert('Došlo je do greške prilikom kreiranja narudžbe.');
      }
    });
  }*/
  orderMedicine(medicineId: number): void {
    const quantityString = prompt('Unesite količinu:');
    const quantity = Number(quantityString);

    if (!quantity || quantity <= 0) {
      alert('Unesite validnu količinu veću od 0.');
      return;
    }

    this.stockService.orderMedicine(medicineId, quantity).subscribe({
      next: () => {
        alert('Narudžba za lijek uspješno kreirana!');
        this.loadMedicines();
      },
      error: (error) => {
        console.error('Greška prilikom narudžbe:', error);
        alert('Došlo je do greške prilikom kreiranja narudžbe.');
      }
    });
  }

}
