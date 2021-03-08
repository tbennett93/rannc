import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Rannc';
  apiUrl : string = 'https://localhost:44359/weatherforecast';
  apiUrl2 : string = 'https://localhost:44359/api/rankable';
  arrayObjects : any[];
  films : any[];


  constructor(private http: HttpClient){};

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
