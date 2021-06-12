import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CategoryModel } from 'src/app/models/category.model';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

export class Tile {
  colour: string;
  cols: number;
  rows: number;
  text: string;
  id: string;
}

export interface Color{
  colour: string;
}

export class RowsColumns{
  rows: number;
  columns: number;
}



@Component({
  templateUrl: './category.component.html',
  selector: 'categories',
  styleUrls: ['./category.component.scss']
})




export class CategoryComponent implements OnInit, OnDestroy {

  title = 'Rannc';
  category: CategoryModel[];
  getLoaded: boolean;

  
  
  
  constructor(private data: DataService, private tokenService: TokenService, private _snackBar: MatSnackBar) { };

  ngOnInit(): void {
    if (this.isUserAuthenticated && this.tokenService.isAccessTokenValid()) {
      this.data.getCategories().subscribe({
        next: (data: CategoryModel[]) => {
          this.category = data;
          console.log(data);
          this.getLoaded = true;
        },
        error: () => {
          console.log("error in getCategoriesObserver");
          this.openSnackBar('Error getting your data. Please try again later.');
        }
      });
    }
  };

  ngOnDestroy(): void{

  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar'];
    config.duration = 3000;
    this._snackBar.open(message, 'close', config);
  }
  
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
      this.openSnackBar('Error. Please enter a category name.');
      return null;
    }


    if (this.tokenService.isAccessTokenValid()) {
      categoryModel.name = name;
      this.data.postCategory(categoryModel).subscribe({
        next: (resp: CategoryModel) => {
          this.category.push(resp);
          inputField.value = '';
        },
        error: err => {
          console.log(err);
          this.openSnackBar('Error adding a new category. Please try again later.');
        }
      });
    }


  }


}
