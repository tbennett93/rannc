import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CategoryModel } from '../models/category.model';
import { DataService } from '../services/data.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  constructor(private data: DataService, private tokenService: TokenService, private _snackBar: MatSnackBar) { };



  categoryTop5: CategoryModel[];
  categoryTrending: CategoryModel[];
  categoryNew: CategoryModel[];


  ngOnInit(): void {
    if (this.tokenService.isAccessTokenValid()) {
      this.data.getCategoriesTop5().subscribe({
        next: (data: CategoryModel[]) => {
          this.categoryTop5 = data;
          console.log(data);
          console.log('data');
        },
        error: () => {
          console.log("error in getCategoriesObserver");
          this.openSnackBar('Error getting top 5 data. Please try again later.');
        }
      });
      this.data.getCategoriesTrending().subscribe({
        next: (data: CategoryModel[]) => {
          this.categoryTrending = data;
          console.log(data);
          console.log('data');
        },
        error: () => {
          console.log("error in getCategoriesObserver");
          this.openSnackBar('Error getting trending data. Please try again later.');
        }
      });

      this.data.getCategoriesNew().subscribe({
        next: (data: CategoryModel[]) => {
          this.categoryNew = data;
          console.log(data);
          console.log('data');
        },
        error: () => {
          console.log("error in getCategoriesObserver");
          this.openSnackBar('Error getting new category data. Please try again later.');
        }
      });      

    }
  };
  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar'];
    config.duration = 3000;
    this._snackBar.open(message, 'close', config);
  }

}
