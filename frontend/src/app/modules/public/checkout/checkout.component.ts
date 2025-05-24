import {ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {CartService} from '../../../services/cart.service';
import {OrderService, OrderCreateDTO, OrderDetailCreateDTO} from '../../../services/order.service';
import {Router} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {Order} from '../../../models/order.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';


@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent {
  userId: number | null = null;
  userForm!: FormGroup;
  isModalVisible = false;
  cardForm!: FormGroup;



  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: MyAuthService,
    private http: HttpClient,
    private fb:FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  closeModal() {
    this.isModalVisible = false;
  }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    this.userId = this.cartService.getUserId();
    this.orderService.getTrackingStages().subscribe((data) => {
      this.stages = data;
    });
    this.today = new Date();
    this.generateOrderId();
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+)?[0-9]{6,15}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
      country: ['', Validators.required],
    });
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/(2[5-9]|[3-9][0-9])$/)
      ]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  getActiveCart(): Observable<any[]> {
    return this.http.get<any[]>('/api/cart/active');
  }

  calculateTotal() {
    this.totalPrice = this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  onSubmitOrder(): void {

    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      alert('Molimo prijavite se kako biste izvršili narudžbu.');
      return;
    }

    if (this.userForm.invalid) {
      this.isModalVisible = true;
      return;
    }

    items: this.cart.map(item => ({
      productId: item.id,
      qty: item.quantity,
      pricePerUnit: item.price
    }))


    const checkoutOrder: OrderCreateDTO = {
      myAppUserId: userId,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email,
      phoneNumber: this.userForm.value.phone,
      address: this.userForm.value.address,
      city: this.userForm.value.city,
      postalCode: this.userForm.value.zip,
      country: this.userForm.value.country,
      totalPrice: this.totalPrice,
      paymentMethod: this.paymentMethod,
      cardNumber: this.paymentMethod === 'card' ? this.cardForm.value.cardNumber : '',
      expiryDate: this.paymentMethod === 'card' ? this.cardForm.value.expiryDate : '',
      cvv: this.paymentMethod === 'card' ? this.cardForm.value.cvv : '',

      items: this.cart.map(item => ({
        productId: item.id,
        qty: item.quantity,
        pricePerUnit: item.price
      }))
    };



    this.orderService.postOrder(checkoutOrder).subscribe({
      next: (response) => {
        alert('Narudžba uspješno izvršena!');
        this.cartService.clearCart();
        // Obavijesti da su notifikacije promijenjene i da treba osvježiti prikaz
        this.notificationService.notifyNotificationsChanged();
        this.router.navigate(['/public']);
      },
      error: (err) => {
        console.error('Greška prilikom kreiranja narudžbe:', err);
        alert('Došlo je do greške prilikom izvršavanja narudžbe.');
      }
    });


  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  orderId!: string;

  generateOrderId() {
    // Jednostavan format: 6 cifara random broja + trenutni timestamp za jedinstvenost
    const random = Math.floor(100000 + Math.random() * 900000); // 6-cifreni broj
    const timestamp = Date.now().toString().slice(-4); // Zadnje 4 cifre vremena
    this.orderId = `#${random}${timestamp}`;
  }

  today: Date = new Date();

  currentStageIndex = 0;
  stages: any[] = [];
  deliveryMethod: string = '';
  paymentMethod: string = '';
  shippingAddress: string = '';
  cart: any[] = [];
  totalPrice: number = 0;
  showError = false;
  errorMessage = '';

  goToNextStage() {
    // if (this.currentStageIndex < 3) this.currentStageIndex++;
    if (this.currentStageIndex === 1) {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched(); // da se prikažu sve greške
        this.errorMessage = 'Please fill in all required user data fields correctly.';
        this.showError = true;
        return;
      }
    }
    if (this.currentStageIndex === 3) {
      if (this.paymentMethod === 'card') {
        // Provjera da li su svi podaci o kartici uneseni
        if (!this.cardNumber || !this.expiryDate || !this.cvv) {
          this.showDeliveryError = true;
          return;
        }
      }
    }
    this.showError = false;
    this.errorMessage = '';
    this.currentStageIndex++;
  }

  closeError() {
    this.showError = false;
  }

  goToPreviousStage() {
    if (this.currentStageIndex > 0) this.currentStageIndex--;
  }

  @ViewChildren('formField') formFields!: QueryList<ElementRef>;

  onDeliveryMethodChange(): void {
    let deliveryCost = 0;

    if (this.deliveryMethod === 'express') {
      deliveryCost = 10; // Express dostava - 10 KM
    } else if (this.deliveryMethod === 'standard') {
      deliveryCost = 6; // Standard dostava - 6 KM
    }

    this.calculateTotalPrice(deliveryCost);
  }

  calculateTotalPrice(deliveryCost: number): void {
    const productsTotal = this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalPrice = productsTotal + deliveryCost;
  }

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  onPaymentMethodChange(): void {
    if (this.paymentMethod !== 'card') {
      this.clearCardDetails();
    }
  }


  clearCardDetails(): void {
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
  }

  isCardDetailsValid(): boolean {
    const cardNumberPattern = /^[0-9]{16}$/; // 16 znamenki
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    const cvvPattern = /^[0-9]{3}$/; // 3 znamenke

    return (
      cardNumberPattern.test(this.cardNumber) &&
      expiryDatePattern.test(this.expiryDate) &&
      cvvPattern.test(this.cvv)
    );
  }

  showDeliveryError = false;
  showPaymentError = false;

  handleNextClick() {
    if (!this.deliveryMethod) {
      this.showDeliveryError = true;
      return;
    }

    this.goToNextStage();
  }

  closeDeliveryError() {
    this.showDeliveryError = false;
  }
  closePaymentError() {
    this.showPaymentError = false;
  }
}

