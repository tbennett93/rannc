import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {

  loggedIn: boolean = false;
  subscription: Subscription;

  constructor(private token: TokenService, private router: Router){
    this.subscription = token.loggedInStateAnnounced$.subscribe(
      state => {
        console.log('state:');
        console.log(state);
        this.loggedIn = state; 
      });

  // this.subscription = token.logoutAnnounced$.subscribe(
  //     state => {
  //     this.loggedIn = state;
  //     });
  }

  ngOnInit(){
    if (this.token.isAccessTokenValid()){
      this.loggedIn = true;
    };

    console.log(this.token.isAccessTokenValid());
    console.log('logged in?:');
    console.log(this.loggedIn);

    
  }

  logout() {
    console.log("attempting to logout");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this.token.announceLoginState(false);
    console.log("logged out");
    this.router.navigate(["Home"]);

  }
}
