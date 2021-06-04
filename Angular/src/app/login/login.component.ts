import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  invalidLogin: boolean;
  constructor(private router: Router, private http: HttpClient, private token: TokenService) { }


  //login works by requesting a token from the server. This will expire in a period defined by the server.
  //The token allows guards to be set up to block access to routes in the front end
  //  simply checking 'does the token exist and has it expired'
  //It can also be made mandatory when submitting API requests
  //  the server will know what web token was issued where and thus can reject false or expired or null web tokens
  login(form: NgForm) {
    console.log('login button clicked');
    const credentials = form.value;
    this.http.post("https://localhost:44359/api/auth/login", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      console.log(response);
      const token = (<any>response).accessToken;
      const refreshToken = (<any>response).refreshToken;

      //local storage is storage used by the browser to store key val pairs
      localStorage.setItem("jwt", token);
      localStorage.setItem("refreshToken", refreshToken);
      this.invalidLogin = false;
      console.log(token);
      this.token.announceLoginState(true);
      this.router.navigate(["/"]);
    }, err => {
      this.invalidLogin = true;
      console.log(err);
    });
  }


}
