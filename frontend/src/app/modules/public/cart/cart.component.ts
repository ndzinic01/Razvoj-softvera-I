import { Component } from '@angular/core';
import {CartService} from '../../../services/cart.service';
import {Router} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {OrderCreateDTO, OrderService} from '../../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: any[] = [];

  showBuyNowModal = false;
  userId: number | null = null;


  constructor(private cartService: CartService,
              private router: Router,
              private authService: MyAuthService,
              private orderService: OrderService,) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }
  navigateToProduct(id: number): void {
    this.router.navigate(['/public/product', id]);
  }

  updateItemTotal(item: any) {
    if (item.quantity < 1) item.quantity = 1;
    const unitPrice = item.discountedPrice && item.discountedPrice < item.price ? item.discountedPrice : item.price;
    item.totalPrice = unitPrice * item.quantity;

  }
  increaseQuantity(item: any): void {
    item.quantity++;
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
  updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeFromCart(itemToRemove: any) {
    this.cart = this.cart.filter(item => item.id !== itemToRemove.id);
    this.updateCartStorage();

  }

  get totalPrice(): number {
    //return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return this.cart.reduce((total, item) => {
      const unitPrice = item.discountedPrice && item.discountedPrice < item.price ? item.discountedPrice : item.price;
      return total + unitPrice * item.quantity;
    }, 0);

  }
  continueShopping(): void {
    this.router.navigate(['/']);
  }
  buyNow() {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/public/checkout');
      this.router.navigate(['/auth/login']);
      return;
    }

    const decoded = this.parseJwt(token);
    const userId = decoded?.nameid;

    if (!userId) {
      alert('User ID not found in token.');
      return;
    }

    this.userId = Number(userId);
    this.showBuyNowModal = true; // otvori modal za potvrdu narudžbe
  }

  parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  confirmCheckout() {
    if (!this.userId) return;

    const order: OrderCreateDTO = {
      myAppUserId: this.userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '123456789',
      address: 'User address',
      city: 'City name',
      postalCode: '71000',
      country: 'Bosnia and Herzegovina',
      totalPrice: this.totalPrice,
      paymentMethod: 'Cash',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      items: this.cart.map(item => ({
        productId: item.id,
        qty: item.quantity,
        pricePerUnit: item.discountedPrice && item.discountedPrice < item.price ? item.discountedPrice : item.price

      }))
    };

    this.orderService.postOrder(order).subscribe({
      next: res => {
        alert('Order placed successfully!');
        this.cart = [];
        localStorage.removeItem('cart');
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error(err);
        alert('Error placing order.');
      }
    });

    this.showBuyNowModal = false;
  }
  cancelCheckout() {
    this.showBuyNowModal = false;
  }

 /* buyNow() {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/public/checkout'); // Spremi URL za preusmjeravanje
      this.router.navigate(['/auth/login']); // Preusmjerenje na login
      return;
    }

    const decoded = parseJwt(token);
    const userId = decoded?.nameid;

    function parseJwt(token: string): any {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    }

    if (!userId) {
      alert('User ID not found in token.');
      return;
    }

    const order: OrderCreateDTO = {
      myAppUserId: parseInt(userId),
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '123456789',
      address: 'User address',
      city: 'City name',
      postalCode: '71000',
      country: 'Bosnia and Herzegovina',
      totalPrice: this.totalPrice,
      paymentMethod: 'Cash',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      items: this.cart.map(item => ({
        productId: item.id,
        qty: item.quantity,
        pricePerUnit: item.price
      }))
    };




    this.orderService.postOrder(order).subscribe({
      next: res => {
        alert('Order placed successfully!');
        this.cart = [];
        localStorage.removeItem('cart');
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error(err);
        alert('Error placing order.');
      }
    });
  }*/
}
