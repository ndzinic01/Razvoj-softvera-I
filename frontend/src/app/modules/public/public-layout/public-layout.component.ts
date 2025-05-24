import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SearchService} from '../../../services/search.service';
import {ProductServicesService} from '../../../services/product-services.service';
import {WishlistService} from '../../../services/wishlist.service';
import {AuthLogoutEndpointService} from '../../../endpoints/auth-endpoints/auth-logout-endpoint.service';
import {RecipeService} from '../../../services/recipe.service';

interface Product {
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
@Component({
  selector: 'app-public-layout',
  standalone: false,

  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
  constructor(private router:Router,
              private  searchService: SearchService,
              private productService: ProductServicesService,
              private logoutService: AuthLogoutEndpointService,
              private recipeService: RecipeService,
  private wishListService: WishlistService, private cdr: ChangeDetectorRef) {
  }
  wishListCount: number = 0;
  ngOnInit() {
    this.wishListService.wishListCount$.subscribe(count => {
      this.wishListCount = count;
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navigation = document.querySelector('.navigation');
    if (window.scrollY > 100) {  // Kad skrolaš više od 100px od vrha
      navigation?.classList.add('sticky');
    } else {
      navigation?.classList.remove('sticky');
    }
  }

  searchQuery: string = '';
  searchResults: Product[] = [];

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.searchResults = [];
      return;
    }

    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        this.searchResults = products.filter(product =>
          product.name.toLowerCase().includes(query)
        );
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja proizvoda:', err);
      }
    });
  }
  goToProduct(productId: number): void {
    this.router.navigate(['/public/product', productId]);
    this.searchResults = []; // Zatvori dropdown
    this.searchQuery = '';   // Očisti input (opcionalno)
  }

  isCustomerLoggedIn(): boolean {
    const tokenString = localStorage.getItem('my-auth-token');
    if (!tokenString) return false;
    try {
      const token = JSON.parse(tokenString);
      return !!token?.myAuthInfo?.isCustomer;
    } catch (e) {
      console.error('Neispravan token format:', e);
      return false;
    }
  }

  showLogoutModal: boolean = false;
  logout() {
    console.log('Logout dugme kliknuto');

    this.showLogoutModal = true;
    this.cdr.detectChanges(); // forsira detekciju promjene
  }




  confirmLogout() {
    this.showLogoutModal = false;

    this.logoutService.handleAsync().subscribe({
      next: () => {
        // Logout uspješan – već redirectaš unutar servisa
      },
      error: (error) => {
        console.error('Logout nije uspio:', error);
      }
    });
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }





  showRecipeModal = false;
  recipes: any[] = [];
  openRecipes() {
    const tokenString = localStorage.getItem('my-auth-token');
    if (!tokenString) {
      console.warn('Token nije pronađen.');
      return;
    }

    try {
      const token = JSON.parse(tokenString);
      const authInfo = token?.myAuthInfo;

      if (!authInfo?.isCustomer) {
        console.warn('Korisnik nije kupac.');
        return;
      }

      const userId = authInfo.userId; // ← OVO JE ISPRAVNO

      if (!userId) {
        console.warn('Korisnički ID nije pronađen.');
        return;
      }

      this.recipeService.getRecipesForUser(userId).subscribe({
        next: (res) => {
          console.log('Učitani recepti:', res);
          this.recipes = res;
          this.showRecipeModal = true; // ← MODAL SE OTVARA
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja recepata:', err);
        }
      });

    } catch (e) {
      console.error('Greška prilikom parsiranja tokena:', e);
    }
  }

  getLoggedUserId(): number | null {
    const tokenString = localStorage.getItem('my-auth-token');
    if (!tokenString) return null;

    try {
      const token = JSON.parse(tokenString);
      return token?.myAuthInfo?.id || null;
    } catch (e) {
      console.error('Neispravan token format:', e);
      return null;
    }
  }

  closeRecipeModal() {
    this.showRecipeModal = false;
  }





}
