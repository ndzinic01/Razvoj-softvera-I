import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BrandService} from '../../../services/brand.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  description:string
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  picture: string;
  categoryId: number;
  brandId: number;
  brand: Brand;
  isDiscounted: boolean;
  discountPercentage: number | null;
  discountedPrice: number;
  datumDodavanja: string;
}

@Component({
  selector: 'app-brands',
  standalone: false,
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  brand: any; // ili napravi poseban interfejs ako želiš tipizaciju

  brands: Brand[] = []; // Koristimo any[] da bismo omogućili rad sa nizovima

  constructor(private brandService: BrandService, private router: Router, private http: HttpClient) {
    this.loadBrands(); // Pozivamo metodu za učitavanje brendova u konstruktoru
  }
  @ViewChild('brandsList', { static: false }) brandsList!: ElementRef;

  scrollLeft() {
    this.brandsList.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.brandsList.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

 /* loadBrands() {
    this.brandService.getBrands().subscribe(
      (data) => {
        this.brands = data;
      },
      (error) => {
        console.error('Error loading brands:', error);
      }
    );
  }*/
  loadBrands() {
    this.brandService.getBrands().subscribe(
      (data) => {
        console.log('RAW podaci sa backenda:', data); // 👈 OVO NAM TREBA
        this.brands = data;
      },
      (error) => {
        console.error('Greška pri učitavanju brendova:', error);
      }
    );
  }

  openBrandProducts(brandId: number) {
    console.log('Kliknut brand ID:', brandId);  // Provjera da li je ID ispravno proslijeđen
    if (brandId) {
      this.router.navigate(['/public/brands-products', brandId]);
    } else {
      console.error('Brand ID je undefined ili null!');
    }
  }


}
