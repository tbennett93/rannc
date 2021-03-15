import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  title = 'Rannc';
  apiUrl : string = 'https://localhost:44359/weatherforecast';
  apiUrl2 : string = 'https://localhost:44359/api/rankable';
  arrayObjects : any[];
  films : any[];


  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router){};

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

  ngOnInit(): void {
    this.http.get(this.apiUrl).subscribe((data: any) => 
      {
        console.log(data);
        this.arrayObjects = data;
      });    
    this.http.get(this.apiUrl2).subscribe((data: any) => 
      {
        console.log(data);
        this.films = data;
      });
  };


}


