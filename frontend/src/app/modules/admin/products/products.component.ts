import { Component, OnInit } from '@angular/core';
import { ProductServicesService} from '../../../services/product-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Product} from'../../../services/product-services.service';
@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  brands: any[] = [];
  categories: any[] = [];
  productForm: FormGroup;
  editing: boolean = false;

  constructor(
    private productService: ProductServicesService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      quantityInStock: [0, Validators.required],
      picture: ['', Validators.required], // ✅ obavezno
      categoryId: [null, Validators.required], // ✅ obavezno
      brandId: [null], // ako je opcionalno
      isDiscounted: [false, Validators.required], // ✅ obavezno
      discountPercentage: [null] // ako je potrebno
    });



  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }


  onSubmit() {
    if (this.productForm.invalid) {
      alert('Molimo popunite sva obavezna polja.');
      return;
    }

    const product = this.productForm.value;
    console.log('Slanje proizvoda:', product);
    // Ako je snižen, mora imati procenat
    if (product.isDiscounted && (!product.discountPercentage || product.discountPercentage <= 0)) {
      alert('Unesite validan procenat sniženja.');
      return;
    }

    if (this.editing) {
      this.productService.updateProduct(product).subscribe(() => {
        this.loadProducts();
        this.productForm.reset();
        this.editing = false;
      });
    } else {
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.loadProducts();
          this.productForm.reset();
        },
        error: (err) => {
          console.error('Greška pri dodavanju proizvoda:', err);
          alert('Greška pri dodavanju proizvoda. Provjerite unose.');
        }
      });
    }
  }


  onEdit(product: Product) {
    this.productForm.patchValue(product);
    this.editing = true;
  }

  onDelete(id: number) {
    if (confirm('Da li ste sigurni da želite obrisati proizvod?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  cancelEdit() {
    this.productForm.reset();
    this.editing = false;
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe({
      next: (data) => this.brands = data,
      error: (err) => console.error(err)
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }
}
