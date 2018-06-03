import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';
import { ApiHelperService } from './api.helper.service';
import { ObjectService } from './object.service';
import { AuthenticationService } from './authentication.service';
import { Events } from 'ionic-angular';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private objectService: ObjectService,
    private injector: Injector,
    private events: Events) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let options: any = {};
     
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
}