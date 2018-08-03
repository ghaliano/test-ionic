import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';
import { AuthenticationService } from './authentication.service';
import { Events } from 'ionic-angular';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  skypeAuthorizationForApiUrl: Array<any> = [
    './assets',
    { method: ['get'], uri: 'stores' }
  ];

  constructor(
    private tokenService: TokenService,
    private injector: Injector,
    private events: Events) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let options: any = {};
    
    if (this.isUrlToSkip(req.url, req.method.toLowerCase())){
      return next.handle(req); 
    }

    if (this.isApiRequest(req.url)) {
      options.setHeaders = {
        Authorization: `Bearer ${this.tokenService.accessToken}`
      }
    }
    const authReq = req.clone(options);
    return next.handle(authReq)
      .catch((err: any, caught) => {
        if (err instanceof HttpErrorResponse) {
            console.log(err);
          if (err.status == 401) {
            this.processLogout();
          }
          if (err.status == 0) {
            this.processNoConnexion();
          }
          
          return Observable.throw(err);
        }
      });
  }

  protected isApiRequest(url) {
    return url.startsWith(environment.server_api);
  }

  processLogout(){
    this.injector.get(AuthenticationService).logout();
    this.events.publish('user:logout:success', true);
  }

  processNoConnexion(){
    this.events.publish('connexion:failed', true);
  }

  private isUrlToSkip(url: string, method: string = '') {
    let found = false;
    this.skypeAuthorizationForApiUrl.forEach((item)=>{
      if (typeof item === 'object'){
        if (url.startsWith(environment.server_api+item.uri) && (item.method.indexOf(method) !== -1)){
        console.log(environment.server_api+item.uri);
        console.log(url);
          found = true;
        } 
      } else {
        if (url.startsWith(environment.server_api+item)){
          found = true;
        } 
      }
    });

    return found;
  }
}