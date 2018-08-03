import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { StringService } from './string.service';
import 'rxjs/Rx';

import { BadInput, NotFoundError, NotAllowedError, AppErrorHandler } from '../services/error.handler';
@Injectable()

export class ApiHelperService {
  constructor(protected http: HttpClient, protected stringService: StringService) { }

  sendApiRequest<T>(method: string, uri: string, headers={}, params={}, body: any): Observable<HttpResponse<T>> {
    let theUrl = environment.server_api + uri + "?" +this.stringService.httpBuildQuery(params);

    if (method === 'get') {
      return this.http
        .get<T>(theUrl, {
          params: {}, observe: 'response'
        })
        .catch(this.handleError);
    }
    else if (method === 'put') {
      return this.http
        .put<T>(theUrl, body, {
          headers: headers, params: {}, observe: 'response'
        })
        .catch(this.handleError);
    }
    else if (method === 'post') {
      return this.http
        .post<T>(theUrl, body, {
          headers: headers, params: {}, observe: 'response'
        })
        .catch(this.handleError);
        
    }
    else if (method === 'delete') {
      return this.http
        .delete<T>(theUrl, {
          headers: headers, params: {}, observe: 'response'
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