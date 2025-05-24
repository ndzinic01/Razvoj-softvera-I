import { Component } from '@angular/core';
import { AuthLogoutEndpointService } from '../../../endpoints/auth-endpoints/auth-logout-endpoint.service';
import {AdminUserService, MyAppUser} from '../../../services/admin-user.service';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  adminUser!: MyAppUser;
  constructor(private logoutService: AuthLogoutEndpointService,
              private adminUserService: AdminUserService,
              private authService: MyAuthService) {}


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
  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.adminUserService.getUserById(userId).subscribe({
        next: (user) => {
          this.adminUser = user;
        },
        error: (err) => {
          console.error('Greška pri dohvatu admin korisnika', err);
        }
      });
    } else {
      console.error('Korisnik nije ulogovan ili nema ID.');
    }
  }

}

