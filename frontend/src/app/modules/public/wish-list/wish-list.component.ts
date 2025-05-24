import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../../services/wishlist.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  imports: [
    CommonModule,
    DecimalPipe
  ],
  standalone: true,
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  wishListProducts: any[] = [];
  toastMessage: string = '';
  showToastMessage: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishListProducts = this.wishlistService.getWishList();
  }

  navigateToProduct(id: number): void {
    this.router.navigate(['/public/product', id]);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishList();
    this.loadWishlist();
  }
  showClearConfirmModal = false;

  showClearConfirm() {
    this.showClearConfirmModal = true;
  }

  confirmClearWishlist() {
    this.clearWishlist();
    this.showClearConfirmModal = false;
  }

  cancelClearWishlist() {
    this.showClearConfirmModal = false;
  }
  alreadyInCartMessage: string = '';
  showAlreadyInCartToast: boolean = false;

  moveToCart(): void {
    for (let product of this.wishListProducts) {
      const existingItem = this.cartService.getCart().find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
        this.toastMessage = `${existingItem.name} is already in the cart. Quantity increased to ${existingItem.quantity}.`;
      } else {
        product.quantity = 1;
        this.cartService.addToCart(product);
        this.toastMessage = `${product.name} has been added to the cart.`;
      }
    }

    this.closeConfirmationModal();
    this.showToastMessage = true;
    this.wishlistService.clearWishList();
    this.loadWishlist();

    setTimeout(() => {
      this.showToastMessage = false;
    }, 13000);
  }


  goToCart(): void {
    this.router.navigate(['/public/cart']);
  }

  openConfirmationModal() {
    this.showConfirmationModal = true;
  }
  showConfirmationModal = false;
  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }
}
