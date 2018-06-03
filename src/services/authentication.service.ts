import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';
import { StringService } from './string.service';
import { environment } from '../environments/environment';

import 'rxjs/Rx';

@Injectable()

export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private stringService: StringService) {
  }

  login(user: any): Observable<any[]> {
    return this
      .http
      .post(environment.server + 'signin',
        this.stringService.httpBuildQuery(user),
        { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
      )
      .map((res: any) => {
        this.tokenService.saveToken(res);
      })
      /*
      .flatMap((userResult) => {
        return this.dataService
        .getItem(this.createInitialUser(this.tokenService.getUserId()))
        .map((userResult)=>{
          return this.setLoggedUser(userResult);
        });
      })
      */
      .catch((res: any) => Observable.throw(res.error || 'Server error'));
  }

  logout() {
    this.tokenService.clearToken();
  }

  isLogged() {
    return this.tokenService.hasToken();
  }
} 
