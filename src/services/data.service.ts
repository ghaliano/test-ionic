import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { ApiHelperService } from './api.helper.service';
import { ObjectService } from './object.service';
import { TokenService } from './token.service';

import { HydraCollection } from '../models/hydra.model';
@Injectable()
export class DataService {
  constructor(private apiHelperService: ApiHelperService, private objectService: ObjectService, private tokenService: TokenService) { }

  public getCollection(resourceObject, params = {}, headers = new HttpHeaders() ): Observable<HydraCollection> {
    return this.sendRequest('get', resourceObject.getCollectionUri(), params, headers, null).map((res) => {
      return this.objectService.hydrateFromApi(new HydraCollection(), JSON.stringify(res['body']));
    });
  }

  public getItem(resourceObject): Observable<any> {
    return this.sendRequest('get', resourceObject.getItemUri(), new HttpParams(), new HttpHeaders(), null).map((res) => {
      return this.objectService.hydrateFromApi(resourceObject, JSON.stringify(res['body']));
    });
  }

  public postItem(resource: any, body: any): Observable<HttpResponse<any>> {
    return this.sendRequest('post',
      resource.getCollectionUri(),
      new HttpParams(),
      new HttpHeaders().set('Content-Type', 'application/json'),
      body
    ).map((res)=>{
      return this.objectService.hydrateFromApi(resource, JSON.stringify(res['body']));
    });
  }

  public putItem(resource: any, body: any): Observable<HttpResponse<any>> {
    return this.sendRequest('put',
      resource.getItemUri(),
      new HttpParams(),
      new HttpHeaders().set('Content-Type', 'application/json'),
      body
    ).map((res)=>{
      return this.objectService.hydrateFromApi(resource, JSON.stringify(res['body']));
    });
  }

  public deleteItem(resource: any): Observable<HttpResponse<any>> {
    return this.sendRequest('delete', resource.getItemUri(), new HttpParams(), new HttpHeaders(), null);
  }

  public upload(resource: any, files, contextId) {
    let formData:FormData = new FormData();
    files.forEach((file, i) => {
      formData.append(contextId, resource.id);
      formData.append('images['+i+']', file, file.name);
    })
    return this.apiHelperService.sendApiRequest('post', resource.getMediaUploadUri(), {}, {}, formData)
    .map((res)=>{
      return res['body'];
    })
  } 

  public deleteCollection(resource, ids: Array<number>): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'delete', 
      resource.getDeleteCollectionUri(), 
      this.buildIdsParams(ids),
      new HttpHeaders().set('Content-Type', 'application/json'),
      null
    );
  }

  public archiveCollection(resource, ids: Array<number>): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'put', 
      resource.getArchiveCollectionUri(), 
      this.buildIdsParams(ids), 
      new HttpHeaders().set('Content-Type', 'application/json'),
      null
    );
  }
  
  public putCollection(resource, data): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'put', 
      resource.getPutCollectionUri(), 
      data, 
      new HttpHeaders().set('Content-Type', 'application/json'),
      null
    );
  }

  public groupCollection(resource, ids: Array<number>, groupId): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'put', 
      resource.getGroupCollectionUri(), 
      this.buildIdsParams(ids).append('group_id', groupId), 
      new HttpHeaders().set('Content-Type', 'application/json'),
      null
    );
  }

  private buildIdsParams(ids: Array<any>){
    let httpParams = new HttpParams();
    ids.forEach(id => {
      httpParams = httpParams.append('ids[]', id);
    });

    return httpParams;
  }

  public sendRequest(method, uri, params, headers, body: any) {
    headers = headers.set("Authorization", `Bearer ${this.tokenService.accessToken}`);

    return this.apiHelperService.sendApiRequest<any>(method, uri, headers, params, JSON.stringify(body));
  }
}