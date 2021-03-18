import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router, private http: HttpClient ) {
  }
  //performs a check on the token. If one exists and hasn't expired, the page is allowed to load, else the login screen is returned
  async canActivate() {
    const token = localStorage.getItem("jwt");
    //jwtHelper is part of JwtHelperService
    if (token && !this.jwtHelper.isTokenExpired(token)){
      console.log(this.jwtHelper.decodeToken(token))
      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if(!isRefreshSuccess){
      this.router.navigate(["login"]);
    }
    return isRefreshSuccess;
  }

    private async tryRefreshingTokens(token: string): Promise<boolean>{

      const refreshToken: string = localStorage.getItem("refreshToken");
      
      if (!token || !refreshToken){
        return false;
      }
      const credentials = JSON.stringify({accessToken: token, refreshToken: refreshToken});

      let isRefreshSuccess: boolean;
      try{
        const response = await this.http.post("https://localhost:44359/API/auth/login", credentials, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          observe: 'response'
        }).toPromise();

        const newToken = (<any>response).body.accessToken;
        const newRefreshToken = (<any>response).body.refreshToken;
        localStorage.setItem("jwt", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        isRefreshSuccess = true;
      }
      catch(ex) {
        isRefreshSuccess = false;
      }
      return isRefreshSuccess;
    }
}
