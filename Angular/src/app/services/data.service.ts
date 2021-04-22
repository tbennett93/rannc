import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResIdObj } from '../models/res-id-obj.model';
import { CategoryModel } from '../models/category.model';
import { CategoryGroupDto, CategoryGroups } from '../models/category-groups';
import { CategoryItem } from '../models/category-item';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get('https://localhost:44359/api/categories')
  }

  postCategory(categoryModel: CategoryModel) {

    // console.log('attempting to post category:');
    // console.log(categoryModel);
    let jsonObject = JSON.stringify(categoryModel);
    // console.log('converted:');
    // console.log(jsonObject);
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.post('https://localhost:44359/api/categories/', jsonObject, headers);
  };

  deleteCategory(id: string) {

    // console.log('attempting to delete category:');
    // console.log(id);
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "categoryId":id
      })
    };
    return this.http.delete('https://localhost:44359/api/categories/', headers);
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

  deleteCategoryGroup(categoryGroupItems: CategoryGroups){
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "categoryGroupId": categoryGroupItems.id.toString(),
        "categoryModelId": categoryGroupItems.categoryId
      })
    }
  return this.http.delete("https://localhost:44359/api/categories/categorygroup", headers);
  }

  moveGroup(groupDto: Array<CategoryGroupDto>){
    
    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }

    let body =  JSON.stringify(groupDto);

    return this.http.put("https://localhost:44359/api/categories/", body, headers)
  }

  moveItem(items: Array<CategoryGroups>){

    let headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    }

    let body =  JSON.stringify(items);

    return this.http.put("https://localhost:44359/api/categories/categorygroup", body, headers)

  }

}

