import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category.model';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  templateUrl: './category.component.html',
  selector: 'categories',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  title = 'Rannc';
  category: CategoryModel[];

  constructor(private data : DataService, private tokenService : TokenService) { };

  ngOnInit(): void {
    if (this.isUserAuthenticated && this.tokenService.isAccessTokenValid()){
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
    if (token) {return true;}
    else {return false;}
  }






}
