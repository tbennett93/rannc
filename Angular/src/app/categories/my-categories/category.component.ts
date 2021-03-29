import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent  {

  // customers: any;
 
  // constructor(private http: HttpClient) { }
 
  // ngOnInit() {
    // //JwtModule attaches JWT with headers on HTTP request
    // //Can verify this works by removing the guard to this route and logging out and accessing the component - this should return a 401 Unauthorized
    
    // this.http.get("https://localhost:44359/api/customers", {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json"
    //   })
    // }).subscribe(response => {
    //   this.customers = response;
    // }, err => {
    //   console.log(err)
    // });
  



}
