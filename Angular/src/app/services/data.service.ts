import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryItem } from '../models/category-item';
import { ResIdObj } from '../models/res-id-obj.model';
import { CategoryModel } from '../models/category.model';
import { CategoryGroups } from '../models/category-groups';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get('https://localhost:44359/api/categories')
  }

  postCategory(categoryModel: CategoryModel) {

    console.log('attempting to post category:');
    console.log(categoryModel);
    let jsonObject = JSON.stringify(categoryModel);
    console.log('converted:');
    console.log(jsonObject);
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post('https://localhost:44359/api/categories/category', jsonObject, headers);
  };


  getCategoryItems(categoryId) {
    const header = new HttpHeaders().set('categoryId', categoryId);
    return this.http.get('https://localhost:44359/api/categories/categoryitems', { 'headers': header })
  }

  postCategoryItems(categoryItem: CategoryItem) {
    console.log('attempting to post:');
    console.log(categoryItem);
    let jsonObject = JSON.stringify(categoryItem);
    console.log('converted:');
    console.log(jsonObject);
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post('https://localhost:44359/api/categories/categoryitem', jsonObject, headers);
  }

  deleteCategoryItem(categoryItemId: string) {
    console.log('attempting to delete:');
    console.log(categoryItemId);

    let dto: ResIdObj = new ResIdObj();
    dto.type = "CategoryItem";
    dto.id = categoryItemId;

    let jsonObject = JSON.stringify(dto);
    var headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Id": categoryItemId,
        "Type": "CategoryItem"
      })
    };
    console.log('converted:');
    console.log(jsonObject);
    return this.http.delete('https://localhost:44359/api/categories/categoryitem', headers);
  }


  postCategoryGroup(categoryGroup: CategoryGroups) {
    console.log('attempting to post category:');
    console.log(categoryGroup);
    let jsonObject = JSON.stringify(categoryGroup);
    console.log('converted:');
    console.log(jsonObject);
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post('https://localhost:44359/api/categories/categorygroup', jsonObject, headers);

  };

  deleteCategoryGroup(categoryGroups: CategoryGroups){
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "categoryGroupId": categoryGroups.id,
        "categoryModelId": categoryGroups.categoryId
      })
    }
  return this.http.delete("https://localhost:44359/api/categories/categorygroup", headers);
  }

}

