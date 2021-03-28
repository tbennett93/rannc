import { Component, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { CategoryModel } from '../models/category.model';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

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

  logout() {
    localStorage.removeItem("jwt");
    console.log("logged out");
  }





}


