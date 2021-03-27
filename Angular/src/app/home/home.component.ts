import { Component, OnInit} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICategory } from '../models/icategory.model';
import { DataService } from '../services/data.service';
import { CategoryModel } from '../models/category.model';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {


  title = 'Rannc';
  arrayObjects: any[];
  films: any[];
  category: CategoryModel[];
  categories: ICategory[];
  categoryName: string;
  categoryId: string;


  constructor(private jwtHelper: JwtHelperService, private data : DataService) { };

  ngOnInit(): void {

    if (this.isUserAuthenticated){
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
    if (token) {
      return true;
    }
    else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem("jwt");
    console.log("logged out");
  }





}


