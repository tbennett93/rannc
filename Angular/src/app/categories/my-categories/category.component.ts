import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category.model';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  templateUrl: './category.component.html',
  selector: 'categories',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  title = 'Rannc';
  category: CategoryModel[];

  constructor(private data: DataService, private tokenService: TokenService) { };

  ngOnInit(): void {
    if (this.isUserAuthenticated && this.tokenService.isAccessTokenValid()) {
      this.data.getCategories().subscribe({
        next: (data: CategoryModel[]) => {
          this.category = data;
        },
        error: () => console.log("error in getCategoriesObserver")
      });
    }
  };

  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt");
    if (token) { return true; }
    else { return false; }
  }


  addNew(inputField) {
    // console.log(inputField.value);
    let categoryModel = new CategoryModel;
    let name = inputField.value;

    if (!name) {
      return null;
    }


    if (this.tokenService.isAccessTokenValid()) {
      categoryModel.name = name;
      this.data.postCategory(categoryModel).subscribe({
        next: (resp: CategoryModel) => {
          this.category.push(resp);
          inputField.value = '';

        },
        error: err => console.log(err)
      });
    }


  }

  deleteCategory(id: string, index) {
    if (confirm("Are you sure you want to delete this category and all contents?")) {

      if (this.tokenService.isAccessTokenValid()) {

        console.log('deleting - ' + id);
        this.data.deleteCategory(id).subscribe({
          next: resp => this.category.splice(index, 1),
          error: err => console.log(err)
        })
      }
    }
  }





}
