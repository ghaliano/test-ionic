import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Store } from '../../models';

import { StoreLikeService } from '../../services/store-like.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'page-store-like',
  templateUrl: 'like.html'
})
export class StoreLikePage {
  stores:Array<Store> = [];
  loading: any;

  constructor(public loadingCtrl: LoadingController,
    protected storeLikeService: StoreLikeService) {
    
  }
  
  ionViewWillEnter(){
    this.fetchLikes(true);

  }

  private fetchLikes(init: Boolean = false) { 
    //this.presentLoadingDefault();
    this.storeLikeService
    .getAll().subscribe((result)=>{
      if (init){
        this.stores = [];
      }
      
      result.getMember().forEach((store)=>{
        this.stores.push(store);
      });
      //this.loading.dismiss();
    });
  }
  public clearAll(){
    this.storeLikeService.clear();
    this.stores = [];
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Chargement...'
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 30000);
  }

  removeLike(el: Store){
    el.uiLiked= false;
    let index = this.stores.findIndex((store: any)=>{
      return el.id == store.id;
    });
    this.stores.splice(index, 1);

    return this.storeLikeService.remove(el);
  }
}
