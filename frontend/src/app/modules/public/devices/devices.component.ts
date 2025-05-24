import {ChangeDetectorRef, Component} from '@angular/core';
import {ProductServicesService} from '../../../services/product-services.service';
import {Router} from '@angular/router';
import {WishlistService} from '../../../services/wishlist.service';
import {CartService} from '../../../services/cart.service';

export interface Product {
  id:number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  picture?: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountedPrice?: number; // ovo mi sami računamo
}

// models/category.model.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-devices',
  standalone: false,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {
  products: Product[] = [];

  constructor(private productServices: ProductServicesService,
              private router: Router,
              private cartService: CartService,
              private wishListService: WishlistService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Specifična logika za učitavanje proizvoda iz kategorije "Your Health"
    this.productServices.getProductsByCategory(5).subscribe(products => { // ID "1" za "Your Health"
      this.products = products;
    });
  }
  goToProduct(productId: number) {
    this.router.navigate(['/public/product', productId]);
  }
  getDiscountedPrice(product: Product): number {
    if (product.isDiscounted && product.discountPercentage) {
      return product.price - (product.price * product.discountPercentage / 100);
    }
    return product.price;
  }
  selectedSortOption: string = ''; // ✅ inicijalizacija bez greške

  get sortedProducts(): Product[] {
    const productsCopy = [...this.products];

    switch (this.selectedSortOption) {
      case 'priceAsc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'nameAsc':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return productsCopy;
    }
  }

  toastMessage: string = '';
  showToastMessage: boolean = false;

  isInWishList(product: any): boolean {
    return this.wishListService.isProductInWishList(product.id);
  }

  navigateToCart() {
    this.router.navigate(['/public/cart']);
  }
  navigateToWishList() {
    this.router.navigate(['/public/wish-list']);
  }

  toastRedirect: 'cart' | 'wishlist' | null = null;

  showToast(message: string, redirect: 'cart' | 'wishlist' | null = null) {
    this.toastMessage = message;
    this.toastRedirect = redirect;
    this.showToastMessage = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToastMessage = false;
      this.toastRedirect = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  toggleWishList(product: any, event: MouseEvent) {
    event.stopPropagation();

    if (this.isInWishList(product)) {
      this.wishListService.removeFromWishList(product.id);
    } else {
      this.wishListService.addToWishList(product);
      this.showToast('Product added to wishlist!', 'wishlist');
    }
  }

  addToCart(product: any): void {
    const existingItem = this.cartService.getCart().find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.showToast(`${existingItem.name} is already in the cart. Quantity increased to ${existingItem.quantity}.`, 'cart');
    } else {
      product.quantity = 1;
      this.cartService.addToCart(product);
      this.showToast(`${product.name} has been added to the cart.`, 'cart');
    }
  }
}
