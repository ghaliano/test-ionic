import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { BadInput, NotFoundError, NotAllowedError, AppErrorHandler } from '../services/error.handler';
@Injectable()

export class ApiHelperService {
  constructor(protected http: HttpClient) { }

  sendApiRequest<T>(method: string, uri: string, headers={}, params={}, body: any): Observable<HttpResponse<T>> {
    if (method === 'get') {
      return this.http
        .get<T>(environment.server_api + uri, {
          params: params, observe: 'response'
        })
        .catch(this.handleError);
    }
    else if (method === 'put') {
      return this.http
        .put<T>(environment.server_api + uri, body, {
          headers: headers, params: params, observe: 'response'
        })
        .catch(this.handleError);
    }
    else if (method === 'post') {
      return this.http
        .post<T>(environment.server_api + uri, body, {
          headers: headers, params: params, observe: 'response'
        })
        .catch(this.handleError);
        
    }
    else if (method === 'delete') {
      return this.http
        .delete<T>(environment.server_api + uri, {
          headers: headers, params: params, observe: 'response'
        })
        .catch(this.handleError);
    }
    else {
      return Observable.throw('Unsupported request: ' + method);
      //console.error('Unsupported request: ' + method);
    }
  }

  handleError(error: Response) {
    if (error.status === 400)
      return Observable.throw(new BadInput(error));

    if (error.status === 404)
      return Observable.throw(new NotFoundError(error));

    if (error.status === 405)
      return Observable.throw(new NotAllowedError(error));

    return Observable.throw(new AppErrorHandler(error));
  }
}