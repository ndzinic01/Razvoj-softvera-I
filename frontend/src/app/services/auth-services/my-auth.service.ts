import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MyAuthInfo} from "./dto/my-auth-info";
import {LoginTokenDto} from './dto/login-token-dto';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class MyAuthService {
  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  getMyAuthInfo(): MyAuthInfo | null {
    return this.getLoginToken()?.myAuthInfo ?? null;
  }

  isLoggedIn(): boolean {
    return this.getMyAuthInfo() != null && this.getMyAuthInfo()!.isLoggedIn;
  }

  isAdmin(): boolean {
    return this.getMyAuthInfo()?.isAdmin ?? false;
  }

  isPharmacist(): boolean {
    return this.getMyAuthInfo()?.isPharmacist ?? false;
  }

  isCustomer(): boolean {
    return this.getMyAuthInfo()?.isCustomer ?? false;
  }

  setLoggedInUser(x: LoginTokenDto | null) {
    if (x == null) {
      window.localStorage.setItem("my-auth-token", '');
    } else {
      window.localStorage.setItem("my-auth-token", JSON.stringify(x));
    }
  }
  getCurrentUserId(): number | null {
    return this.getMyAuthInfo()?.userId ?? null;
  }

  getLoginToken(): LoginTokenDto | null {
    let tokenString = window.localStorage.getItem("my-auth-token") ?? "";
    try {
      return JSON.parse(tokenString);
    } catch (e) {
      return null;
    }
  }

  // U MyAuthService, nakon što je korisnik uspješno prijavljen:
  loginSuccessful(): void {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      this.router.navigate([redirectUrl]); // Preusmjeri na URL spremljen u localStorage
    } else {
      this.router.navigate(['/']); // Ako nema spremljenog URL-a, preusmjerenje ide na home
    }
  }






}
