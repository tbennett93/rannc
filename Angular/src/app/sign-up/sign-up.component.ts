import { HttpClient } from '@angular/common/http';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  invalidSignup: boolean;
  notFocussed: boolean = true;
  invalidSignupReason: string;

  signUp(form: NgForm){
    const credentials = form.value;
    this.http.post('https://localhost:44359/API/auth/register', credentials).subscribe({
      next: response => { 
        this.invalidSignup = false;
        this.router.navigate(["/login"]);},
      error: err => {
        console.log(err);
        this.invalidSignup = true;
        this.invalidSignupReason = err.error;
        console.log(this.invalidSignupReason);
      }
    })

  }
  ngOnInit(): void {
  }

}
