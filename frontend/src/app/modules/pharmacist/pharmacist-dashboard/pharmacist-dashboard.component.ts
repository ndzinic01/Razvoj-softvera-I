import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {HttpClient} from '@angular/common/http';
import {PharmacistProfileService} from '../../../services/pharmacist-profile.service';
import {Router} from '@angular/router';
export interface PharmacistProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phonenumber?: string;
  employmentDate: string;
  profileImageUrl?: string; // Ako je opcionalno
}

@Component({
  selector: 'app-pharmacist-dashboard',
  standalone: false,
  templateUrl: './pharmacist-dashboard.component.html',
  styleUrl: './pharmacist-dashboard.component.css'
})
export class PharmacistDashboardComponent implements OnInit {
  profile: PharmacistProfile = {} as PharmacistProfile; // Ovdje postavi inicijalnu vrijednost
  firstName?: string;
  lastName?: string;
  email?: string;
  employmentDate?: string;


  constructor(private pharmacistProfileService: PharmacistProfileService,private http: HttpClient, private router: Router) {}

  /*ngOnInit(): void {
    const username = 'your-username';  // Dobavi korisničko ime iz sesije ili konteksta
    this.pharmacistProfileService.getProfile(username).subscribe(
      (data) => {
        this.profile = data;
      },
      (error) => {
        console.error('Error fetching pharmacist profile:', error);
      }
    );

  }*/

  ngOnInit(): void {
    const username = 'your-username';  // Ovdje uzmi username iz sesije ili konteksta korisnika

    this.pharmacistProfileService.getProfile(username).subscribe(
      (data: PharmacistProfile) => {
        this.profile = data;  // Čuvanje podataka u profil
        console.log('Profile Data:', data); // Provjeriti sve podatke
      },
      (error) => {
        console.error('Error fetching pharmacist profile:', error);
      }
    );
  }





  profileImageUrl: string | null = null; // URL slike
  selectedFile: File | null = null; // Izabrana slika za upload
  oldPassword: string = '';
  newPassword: string = '';

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Lokalni preview slike prije slanja na backend
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.profileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /*updateProfile() {
    const formData = new FormData();
    formData.append('email', this.profile.email);
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    this.http.put('https://localhost:7057/update-profile', formData).subscribe({
      next: (response) => {
        console.log('Profil je uspešno ažuriran', response);
      },
      error: (error) => {
        console.error('Greška pri ažuriranju:', error);
        alert(`Greška pri ažuriranju: ${error.message}`);
      }
    });
  }*/
  /*updateProfile() {
    const formData = new FormData();
    formData.append('email', this.profile.email);
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    this.http.put('https://localhost:7057/api/pharmacist/update-profile', formData).subscribe({
      next: (response) => {
        console.log('Profil je uspešno ažuriran', response);
        alert('Profil je uspješno ažuriran!');
      },
      error: (error) => {
        console.error('Greška pri ažuriranju:', error);
        alert(`Greška pri ažuriranju: ${error.message}`);
      }
    });
  }*/
  updateProfile() {
    const formData = new FormData();
    formData.append('firstName', this.profile.firstName);
    formData.append('lastName', this.profile.lastName);
    formData.append('email', this.profile.email);
    formData.append('username', this.profile.username); // ako treba
    formData.append('employmentDate', this.profile.employmentDate);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    this.pharmacistProfileService.updateProfile(formData).subscribe({
      next: (response) => {
        alert('Profil je uspješno ažuriran!');
        console.log('Profil ažuriran:', response);
      },
      error: (error) => {
        console.error('Greška pri ažuriranju:', error);
        alert(`Greška pri ažuriranju: ${error.message}`);
      }
    });
  }



  showPasswordModal = false;

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Nove lozinke se ne poklapaju.');
      return;
    }

    this.pharmacistProfileService.changePassword(this.passwordData).subscribe({
      next: () => {
        alert('Lozinka uspješno promijenjena!');
        this.showPasswordModal = false;
        this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri promjeni lozinke.');
      }
    });
  }






}
