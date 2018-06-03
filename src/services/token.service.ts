import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';
import { Storage } from '@ionic/storage';
@Injectable()

export class TokenService{
  public accessToken: string;
  constructor(private storage: Storage) { }

  saveToken(token: Token) {
    this.accessToken = token.access_token;
    this.storage.set('token', JSON.stringify(token));
  }
  
  clearToken() {
    this.storage.remove('token');
  }

  getAttr(attr) {
    return this.storage.get('token').then((token)=>{
      return (token?JSON.parse(token):{})[attr];
    });
  }

  hasToken() {
    return this.storage.get('token').then((token)=>{
      return token?true:false;
    });
  }

  refreshLiveAccessToken(){
    return this.getAttr('access_token').then((token)=>{
      this.accessToken = token;
    });
  }
} 