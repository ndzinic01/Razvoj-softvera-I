import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProductServicesService } from '../../../services/product-services.service';
import {CartService} from '../../../services/cart.service';
import {ReviewService} from '../../../services/review.service';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  picture?: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountedPrice?: number;
  imageUrl?: string; // ✅ Dodaj ovo da ne puca
  reviews: Review[]; // OVO JE BITNO
}

export interface Review {
  id?: number;
  userName: string;
  text: string;
  rating: number;
  productId: number;
}

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
/*export class ProductDetailsComponent implements OnInit {

  productId: number=0;
 // product: Product = { id: 0, name: '', description: '', price: 0, quantityInStock: 0, picture: '',
   // isDiscounted: false, discountPercentage: 0, reviews: [] };
 // newReview: Review = { userName: '', text: '', rating: 0, productId: 0 };

  //showReviewForm: boolean = false;
  showError: boolean = false;

  @ViewChild('reviewForm') reviewFormElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServicesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
    private reviewService: ReviewService,
  ) {}
  toggleReviewForm(event: Event): void {
    event.preventDefault();
    this.showReviewForm = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.reviewFormElement?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  showSimilarProducts: boolean = false;
  @ViewChild('topElement') topElement: ElementRef | undefined;
  toggle(event: Event): void {
    event.preventDefault();
    this.showSimilarProducts = true;

    setTimeout(() => {
      if (this.topElement) {
        this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  submitReview() {
    if (!this.newReview.userName.trim() || !this.newReview.text.trim() || !this.newReview.rating) {
      this.showError = true;
      console.error("Please fill all fields before submitting the review.");
      return;
    }

    this.newReview.rating = Number(this.newReview.rating);

    if (isNaN(this.newReview.rating) || this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.showError = true;
      console.error("Rating must be a number between 1 and 5.");
      return;
    }

    if (!this.newReview.productId && this.product?.id) {
      this.newReview.productId = this.product.id;
    }

    this.productService.addReview(this.newReview).subscribe({
      next: (response) => {
        console.log("Review added successfully!", response);
        this.newReview = { userName: '', text: '', rating: 0, productId: this.product.id };
        this.showError = false;

        // Push new review into the product reviews array
        this.product.reviews.push(this.newReview);

        alert("Recenzija uspješno dodana! ✅");
      },
      error: (error) => {
        console.error("Error submitting review", error);
        this.showError = true;
      }
    });
  }


  currentProduct!: Product;
  similarProducts: Product[] = [];

  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        this.product = product;
        this.newReview.productId = this.product.id; // Postavljanje ID-a proizvoda u recenziju
        // Pozivamo loadSimilarProducts samo nakon što je proizvod učitan
        this.loadSimilarProducts();
      },
      (error) => {
        console.error('Error fetching product details', error);
        this.showError = true;
      }
    );
  }
  ngOnInit() {
    const productId = this.route.snapshot.params['id'];

    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.getProductDetails();
      this.getReviews();
    });
    this.productService.getProductById(productId)
      .subscribe({
        next: (product) => {
          this.currentProduct = product;
          this.loadSimilarProducts();
        },
        error: (error) => {
          console.error('Error loading product:', error);
        }
      });
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
    });
    this.getReviews();
  }
  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.loadSimilarProducts();
    });
  }
  loadSimilarProducts() {
    if (!this.currentProduct || !this.currentProduct.name) {
      console.error('Current product is not loaded yet.');
      return;
    }

    const keyword = this.currentProduct.name.split(' ')[0];
    this.productService.getSimilarProducts(keyword, this.currentProduct.id)
      .subscribe({
        next: (products) => {
          // Makni trenutni proizvod iz liste
          this.similarProducts = products.filter(p => p.id !== this.currentProduct.id);
        },
        error: (error) => {
          console.error('Error loading similar products:', error);
        }
      });
  }
  navigateToProduct(productId: number): void {
    this.router.navigate(['/public/product', productId]);
  }


  toastRedirect: 'cart' | 'wishlist' | null = null;
  quantity: number = 1;
  toastMessage: string = '';
  showToastMessage: boolean = false;
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
  navigateToCart() {
    this.router.navigate(['/public/cart']);
  }
  addToCart(product: any) {
    const quantityToAdd = this.quantity;

    const existingItem = this.cartService.getCart().find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantityToAdd;
      this.showToast(`${existingItem.name} is already in the cart. Quantity increased to ${existingItem.quantity}.`, 'cart');
    } else {
      const productToAdd = { ...product, quantity: quantityToAdd };
      this.cartService.addToCart(productToAdd);
      this.showToast(`${product.name} has been added to the cart. Quantity: ${quantityToAdd}.`, 'cart');
    }
  }


  product: any;
  reviews: Review[] = [];
  newReview: Review = { userName: '', rating: 5, text: '', productId: 0 };
  showReviewForm = false;


  getReviews(): void {

    this.productService.getReviewsByProduct(this.productId).subscribe((reviews: any[]) => {
      this.reviews = reviews;
    });
  }

  showReviews = false;

  toggleReviewDisplay(event: Event): void {
    event.preventDefault();
    this.showReviews = !this.showReviews;

    if (this.showReviews) {
      setTimeout(() => {
        const el = document.getElementById('reviewsSection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }


}*/
export class ProductDetailsComponent implements OnInit {
  productId: number = 0;
  product!: Product;
  reviews: Review[] = [];
  newReview: Review = { userName: '', text: '', rating: 5, productId: 0 };

  showReviewForm = false;
  showError = false;
  showSimilarProducts = false;
  showReviews = false;

  similarProducts: Product[] = [];
  quantity: number = 1;
  toastMessage: string = '';
  showToastMessage: boolean = false;
  toastRedirect: 'cart' | 'wishlist' | 'error' | 'success' | null = null;

  @ViewChild('reviewForm') reviewFormElement!: ElementRef;
  @ViewChild('topElement') topElement: ElementRef | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServicesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct(this.productId);
      this.getReviews();
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.newReview.productId = product.id;
        this.loadSimilarProducts();
      },
      error: (err) => {
        console.error("Error loading product:", err);
        this.showError = true;
      }
    });
  }

  loadSimilarProducts() {
    if (!this.product?.name) return;

    const keyword = this.product.name.split(' ')[0];
    this.productService.getSimilarProducts(keyword, this.product.id).subscribe({
      next: (products) => {
        this.similarProducts = products.filter(p => p.id !== this.product.id);
      },
      error: (err) => {
        console.error("Error loading similar products:", err);
      }
    });
  }

  getReviews() {
    this.productService.getReviewsByProduct(this.productId).subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  toggleReviewForm(event: Event): void {
    event.preventDefault();
    this.showReviewForm = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.reviewFormElement?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  toggleReviewDisplay(event: Event): void {
    event.preventDefault();
    this.showReviews = !this.showReviews;
    if (this.showReviews) {
      setTimeout(() => {
        const el = document.getElementById('reviewsSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }

  toggle(event: Event): void {
    event.preventDefault();
    this.showSimilarProducts = true;
    setTimeout(() => {
      this.topElement?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  submitReview() {
    /*if (!this.newReview.userName.trim() || !this.newReview.text.trim() || !this.newReview.rating) {
      this.showError = true;
      return;
    }*/
    if (!this.newReview.userName || !this.newReview.rating || !this.newReview.text) {
      this.toastMessage = 'Please fill out all fields before submitting your review.';
      this.toastRedirect = 'error'; // Prikazuje crvenu poruku
      this.showToastMessage = true;

      setTimeout(() => {
        this.showToastMessage = false;
      }, 3000);
      return;
    }
    this.newReview.rating = Number(this.newReview.rating);
    /*if (isNaN(this.newReview.rating) || this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.showError = true;
      return;
    }*/
    if (isNaN(this.newReview.rating) || this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.showError = true;
      return;
    }
    if (!this.newReview.productId && this.product?.id) {
      this.newReview.productId = this.product.id;
    }
    this.productService.addReview(this.newReview).subscribe({
      next: () => {
        this.newReview = {
          userName: '',
          text: '',
          rating: 5,
          productId: this.product.id
        };

        this.showError = false;
        this.getReviews();

        this.toastMessage = 'Review successfully added!';
        this.toastRedirect = 'success'; // Zelena poruka
        this.showToastMessage = true;

        setTimeout(() => {
          this.showToastMessage = false;
        }, 3000);
      },
      error: () => {
        this.showError = true;
        this.toastMessage = 'Error adding review.';
        this.showToastMessage = true;

        setTimeout(() => {
          this.showToastMessage = false;
        }, 3000);
      }
    });

  }
  successMessage: string = '';

  addToCart(product: Product) {
    const quantityToAdd = this.quantity;
    const existingItem = this.cartService.getCart().find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantityToAdd;
      this.showToast(`${existingItem.name} is already in the cart. Quantity increased to ${existingItem.quantity}.`, 'cart');
    } else {
      const productToAdd = { ...product, quantity: quantityToAdd };
      this.cartService.addToCart(productToAdd);
      this.showToast(`${product.name} has been added to cart. Quantity: ${quantityToAdd}.`, 'cart');
    }
  }

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

  navigateToCart() {
    this.router.navigate(['/public/cart']);
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/public/product', productId]);
  }
}
