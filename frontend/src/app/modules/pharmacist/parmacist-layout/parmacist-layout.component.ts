import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthLogoutEndpointService} from '../../../endpoints/auth-endpoints/auth-logout-endpoint.service';

@Component({
  selector: 'app-parmacist-layout',
  standalone: false,
  templateUrl: './parmacist-layout.component.html',
  styleUrl: './parmacist-layout.component.css'
})
export class ParmacistLayoutComponent {
  currentPharmacist: any; // Zamijeni sa pravim modelom ako koristiš
  constructor(private router: Router,private logoutService: AuthLogoutEndpointService) {
    // Primjer: dohvat trenutnog farmaceuta iz localStorage
    const user = localStorage.getItem('pharmacist');
    if (user) {
      this.currentPharmacist = JSON.parse(user);
    }
  }


  /*logout(): void {
    const confirmLogout = confirm('Da li želite da se odjavite sa stranice?');
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  } */

  showLogoutModal: boolean = false;
  logout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.logoutService.handleAsync().subscribe({
      next: () => {},
      error: () => {}
    });
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

}
