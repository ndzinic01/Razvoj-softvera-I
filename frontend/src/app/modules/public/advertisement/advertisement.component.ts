import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-advertisement',
  standalone: false,
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {
  advertisements: any[] = []; // Lista reklama dobijenih sa servera
  currentAdIndex = 0; // Trenutno prikazana reklama
  currentAdvertisement: any; // Trenutna reklama koja se prikazuje

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAdvertisements(); // Učitaj reklame pri pokretanju komponente
  }

  // Funkcija za učitavanje reklama sa servera
  fetchAdvertisements() {
    this.http.get<any[]>('http://localhost:5077/api/GetAdvertisementEndpoint') // Prilagodi URL ako je potrebno
      .subscribe(
        (data) => {
          this.advertisements = data;
          if (this.advertisements.length > 0) {
            this.updateCurrentAdvertisement();
            this.startSlideshow();
          }
        },
        (error) => {
          console.error('Error fetching advertisements:', error);
        }
      );
  }

  // Funkcija koja startuje automatsko pomeranje reklama
  startSlideshow() {
    setInterval(() => {
      this.nextAdvertisement();
    }, 3500);
  }

  onImageError() {
    console.log('Slika nije mogla biti učitana');
    // Možete prikazati fallback sliku ili izvršiti dodatne akcije
  }

  // Funkcija za prikaz sledeće reklame
  nextAdvertisement() {
    this.currentAdIndex = (this.currentAdIndex + 1) % this.advertisements.length;
    this.updateCurrentAdvertisement();
  }

  // Funkcija za prikaz prethodne reklame
  previousAdvertisement() {
    this.currentAdIndex = (this.currentAdIndex - 1 + this.advertisements.length) % this.advertisements.length;
    this.updateCurrentAdvertisement();
  }

  // Funkcija koja postavlja trenutnu reklamu prema indeksu
  updateCurrentAdvertisement() {
    this.currentAdvertisement = this.advertisements[this.currentAdIndex];
  }
}

