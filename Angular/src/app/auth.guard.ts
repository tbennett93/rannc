import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService} from './services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService : TokenService) { }

  async canActivate(){

    const tokenIsValid = await this.tokenService.isAccessTokenValid();
    // console.log(tokenIsValid);
    if (!tokenIsValid) {this.router.navigateByUrl('/login')};
    return  tokenIsValid;
  }
}
