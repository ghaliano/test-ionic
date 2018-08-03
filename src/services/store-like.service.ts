import { Injectable } from '@angular/core';
import { Store } from '../models/store.model';
import { HydraCollection } from '../models/hydra.model';
import { Storage } from '@ionic/storage';
import { ObjectService } from './object.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StoreLikeService{
  namespace:string = "store_like";
  constructor(private storage: Storage, private objectService: ObjectService) { }

  set(el: Store) {
    this.storage.get(this.namespace).then((res)=>{
      let stores = res?JSON.parse(res):[];
      stores.push(el);
      this.storage.set(this.namespace, JSON.stringify(stores));
    });
  }

  toggle(el: Store){
    let prom = this.storage.get(this.namespace).then((res: any)=>{
      let stores = res?JSON.parse(res):[];
      let index = stores.findIndex((store: any)=>{
        return el.id == store.id;
      });
      if (index != -1){
        stores.splice(index, 1);
      } else {
        stores.push(el);
      }
      this.storage.set(this.namespace, JSON.stringify(stores));

      return true;
    });

    return Observable.fromPromise(prom);
  }

  remove(el: Store) {
    this.storage.get(this.namespace).then((res: any)=>{
      let stores = res?JSON.parse(res):[];
      let index = stores.findIndex((store: any)=>{
        return el.id == store.id;
      });
      stores.splice(index, 1);
      this.storage.set(this.namespace, JSON.stringify(stores));
    });
  }
  
  clear() {
    this.storage.remove(this.namespace);
  }

  getAll() {
    let prom = this.storage.get(this.namespace).then((res)=>{

      let hydra = new HydraCollection();

      let stores = res?JSON.parse(res):[];
      stores.forEach((store) =>{
        hydra['hydra:member'].push(this.objectService.hydrateFromApi(new Store(), JSON.stringify(store)));
      })
      return hydra;
    });
    return Observable.fromPromise(prom);
  }
} 