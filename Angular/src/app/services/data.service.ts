import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryItem } from '../models/category-item';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get('https://localhost:44359/api/categories')
  }

  getCategoryItems(categoryId) {
    const header = new HttpHeaders().set('categoryId', categoryId);
    return this.http.get('https://localhost:44359/api/categories/category', { 'headers': header })
  }

  postCategoryItems(categoryItem: CategoryItem) {
    console.log('attempting to post:');
    console.log(categoryItem);
    let jsonObject = JSON.stringify(categoryItem);
    console.log('converted:');
    console.log(jsonObject);
    return this.http.post('https://localhost:44359/api/categories/category', jsonObject,{headers: new HttpHeaders({
      "Content-Type": "application/json"
    }),
    
  });
  }

}
