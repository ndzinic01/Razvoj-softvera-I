  import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginEndpointService } from '../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyInputTextType } from '../../shared/my-reactive-forms/my-input-text/my-input-text.component';
  import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  form: FormGroup;
  loginError: boolean = false;
  protected readonly MyInputTextType = MyInputTextType;

  constructor(
    private fb: FormBuilder,
    private authLoginService: AuthLoginEndpointService,
    private authService: MyAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['admin', [Validators.required, Validators.min(2), Validators.max(15)]],
      password: ['test', [Validators.required, Validators.min(2), Validators.max(30)]],
    });
  }

  /*onLogin(): void {
    if (this.form.invalid) return;

    this.authLoginService.handleAsync(this.form.value).subscribe({
      next: () => {
        const loginToken = this.authLoginService.myAuthService.getLoginToken();

        // ➡️ Spasi userId u LocalStorage
        const userId = loginToken?.myAuthInfo?.userId;
        if (userId) {
          localStorage.setItem('userId', userId.toString());
        } else {
          console.error('User ID nije pronađen u tokenu!');
        }

        // ➡️ Redirekcija nakon uspješnog login-a
        if (loginToken?.myAuthInfo?.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else if (loginToken?.myAuthInfo?.isPharmacist) {
          this.router.navigate(['/pharmacist']);
        } else if (loginToken?.myAuthInfo?.isCustomer) {
          this.router.navigate(['/public']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.form.setErrors({ loginFailed: true });
      }
    });
  }*/

  /*onLogin(): void {
    if (this.form.invalid) return;

    this.authLoginService.handleAsync(this.form.value).subscribe({
      next: () => {
        const token = this.authLoginService.myAuthService.getLoginToken();

        if (!token) {
          this.router.navigate(['/unauthorized']);
          return;
        }

        this.authLoginService.myAuthService.setLoggedInUser(token);

        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl && token.myAuthInfo?.isCustomer) {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigate([redirectUrl]);
        } else if (token.myAuthInfo?.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else if (token.myAuthInfo?.isPharmacist) {
          this.router.navigate(['/pharmacist']);
        } else if (token.myAuthInfo?.isCustomer) {
          this.router.navigate(['/public']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.form.setErrors({ loginFailed: true });
      }
    });
  }*/


  onLogin(): void {
    if (this.form.invalid) return;

    this.authLoginService.handleAsync(this.form.value).subscribe({
      next: () => {
        const token = this.authLoginService.myAuthService.getLoginToken();

        if (!token) {
          this.router.navigate(['/unauthorized']);
          return;
        }

        this.authLoginService.myAuthService.setLoggedInUser(token);

        // Provjeri ako postoji 'redirectAfterLogin' u localStorage
        const redirectUrl = localStorage.getItem('redirectAfterLogin');

        // Ako je korisnik prijavljen putem Buy Now, preusmjeri na checkout
        if (redirectUrl && token.myAuthInfo?.isCustomer) {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigate([redirectUrl]);
        }
        // Ako korisnik nije došao sa Buy Now, odabrati će drugi URL
        else if (token.myAuthInfo?.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else if (token.myAuthInfo?.isPharmacist) {
          this.router.navigate(['/pharmacist']);
        } else if (token.myAuthInfo?.isCustomer) {
          this.router.navigate(['/public']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },

      error: (err) => {
        console.error('Login failed:', err);
        this.form.setErrors({ loginFailed: true });
      }
    });
  }

}
