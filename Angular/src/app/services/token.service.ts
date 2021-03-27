import { Injectable } from '@angular/core';
import { JwtHelperService} from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor(private http: HttpClient, private jwt: JwtHelperService ) {

  }

  public async isAccessTokenValid(): Promise<boolean>{

    const token = localStorage.getItem("jwt");

    if (token && !this.jwt.isTokenExpired(token)){
      return true;
    }
   
    const isRefreshSuccess = await this.tryRefreshingTokens(token);

    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(token: string) : Promise<boolean>{

    const refreshToken: string = localStorage.getItem("refreshToken");

    if(!token || !refreshToken){
      return false
    }

    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });

    let isRefreshSuccess: boolean;
    try {
      const response = await this.http.post("https://localhost:44359/API/token/refresh", credentials, {
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
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
    
  }
}
