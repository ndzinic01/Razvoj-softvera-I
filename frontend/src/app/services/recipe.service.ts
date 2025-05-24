import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Recipe {
  id: number;
  dateOfIssue: Date;
  doctorFirstname: string;
  doctorLastname: string;
  myAppUserId: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) { }
  private baseUrl = 'https://localhost:7057/api/recipes';


  /*getByUserId(userId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`https://localhost:7057/api/recipes/user/${userId}`);
  }*/

  getRecipesForUser(userId: number | null) {
    if (userId === null) {
      throw new Error('User ID je null.');
    }
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

}
