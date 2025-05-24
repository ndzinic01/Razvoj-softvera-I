import { Component, OnInit } from '@angular/core';
import {AdminUserService, MyAppUser} from '../../../services/admin-user.service';
import {prepareFullUserObject} from '../../../helper/user-helper';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {
  users: MyAppUser[] = [];

  constructor(private userService: AdminUserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: res => this.users = res,
      error: err => console.error('Greška pri dohvatu korisnika:', err)
    });
  }
  // admin-users.component.ts
  updateRole(user: any) {
    const fullUser = prepareFullUserObject(user);
    this.userService.updateUser(fullUser).subscribe({
      next: () => console.log('Uloge ažurirane.'),
      error: (err) => console.error('Greška prilikom ažuriranja:', err)
    });
  }


  deleteUser(userId: number) {
    const confirmed = confirm('Da li ste sigurni da želite obrisati korisnika?');
    if (confirmed) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          console.log('Korisnik obrisan.');
        },
        error: (err) => console.error('Greška prilikom brisanja:', err)
      });
    }
  }
  toggleRole(user: any, selectedRole: 'isAdmin' | 'isPharmacist' | 'isCustomer') {
    // Isključi sve uloge
    user.isAdmin = false;
    user.isPharmacist = false;
    user.isCustomer = false;

    // Uključi samo odabranu ulogu
    user[selectedRole] = true;

    const fullUser = prepareFullUserObject(user);
    this.userService.updateUser(fullUser).subscribe({
      next: () => console.log('Uloga uspješno ažurirana.'),
      error: (err) => console.error('Greška prilikom ažuriranja:', err)
    });
  }

}
