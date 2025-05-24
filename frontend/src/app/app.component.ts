import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false
})
export class AppComponent {
  languages = [
    {code: 'bs', label: 'Bosanski'},
    {code: 'en', label: 'English'}
  ];

  title = 'frontend';




  constructor(private translate: TranslateService) {
    // Postavi default jezik
    this.translate.setDefaultLang('en');
    this.translate.use('en');

  }
  changeLanguage(lang: string): void {
    this.translate.use(lang); // Promjena jezika hodu
  }


}
