import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductServicesService} from '../../../services/product-services.service';
import {BrandService} from '../../../services/brand.service';
import {BrandsComponent} from '../brands/brands.component';
import {HttpClient} from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  picture: string;
  categoryId: number;
  brandId: number;
  isDiscounted: boolean;
  discountPercentage: number | null;
  discountedPrice: number;
  datumDodavanja: Date;
}

@Component({
  selector: 'app-brands-products',
  standalone: false,
  templateUrl: './brands-products.component.html',
  styleUrl: './brands-products.component.css'
})
export class BrandsProductComponent implements OnInit {
  brandId!: number;
  products: any[] = [];
  brand: any;


  constructor(private route: ActivatedRoute,
              private productService: ProductServicesService,
              private brandService: BrandService,
              private router: Router,) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Received brandId:', id); // <== vidi šta dolazi
      this.brandId = id ? +id : NaN;
      console.log('Parsed brandId:', this.brandId);

      if (!isNaN(this.brandId)) {
        this.loadProducts();
        this.getBrandDetails();

      } else {
        console.error('Brand ID nije ispravan!');
      }
    });

  }

  getBrandDetails() {
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (data) => {
        this.brand = data;
        console.log('Brand data:', this.brand);  // Check if logoUrl exists
      },
      error: (err) => {
        console.error('Error loading brand:', err);
      }
    });
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/public/product', productId]);
  }

  loadProducts() {
    // Provjera da brandId nije undefined ili null prije poziva servisa
    if (this.brandId) {
      console.log('Calling getProductsByBrand with brandId:', this.brandId);
      this.productService.getProductsByBrand(this.brandId).subscribe(
        (data) => {
          this.products = data;
          console.log('Proizvodi učitani za brandId:', this.brandId, data);
        },
        (error) => {
          console.error('Greška prilikom učitavanja proizvoda:', error);
        }
      );
    } else {
      console.error('Brand ID nije ispravan!');
    }
  }
}
