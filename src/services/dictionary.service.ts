import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DictionaryService{
  constructor(private http: HttpClient) {
  }

  get(namespace){
    return this.http.get("./assets/dictionary/"+namespace+".json");
  }
} 