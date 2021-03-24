import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICategory } from '../models/icategory.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class Category {
  id : string;
  name: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {


  title = 'Rannc';
  apiCategories : string = 'https://localhost:44359/api/categories';
  arrayObjects : any[];
  films : any[];
  category : Category[];
  categories : ICategory[];
  categoryName : string;
  categoryId : string;


  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router){};

  getCategories(id: number) {

    var idString = id.toString();
    const headerDict = {
      'userid': idString
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get(this.apiCategories, requestOptions).
        pipe(
           map((data: Category[]) => {
             return data;
           })
        )
    }

  ngOnInit(): void {

    const getCategoriesObserver = {
      next: (data: Category[]) => {
        this.category = data;
        // this.categoryId = data[0].name;
        console.log(data);
      },
      error: () => console.log("error in getCategoriesObserver")
    }

    this.getCategories(3).subscribe(getCategoriesObserver);
    
      


  };

  isUserAuthenticated(){
    const token: string = localStorage.getItem("jwt");
    if(token){
      return true;
    }
    else {
      return false;      
    }
  }

  logout(){
    localStorage.removeItem("jwt");
    console.log("logged out");
  }

  



}


