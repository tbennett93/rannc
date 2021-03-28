import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    
    return this.http.get('https://localhost:44359/api/categories/category', {'headers' : header})
  }



}
