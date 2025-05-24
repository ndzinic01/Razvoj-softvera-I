import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {RecipeService} from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe',
  standalone: false,
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent {
  recipes: any[] = [];

  constructor(private recipeService: RecipeService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    if (userId) {
      this.recipeService.getRecipesForUser(userId).subscribe({
        next: (data) => {
          this.recipes = data;
        },
        error: (err) => {
          console.error('Error fetching recipes:', err);
        }
      });
    }
  }

}
