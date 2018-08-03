import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, LoadingController, ModalController  } from 'ionic-angular';
import { DictionaryService } from '../../services/dictionary.service';
import { Store, Bait } from '../../models';

import { StoreLikeService } from '../../services/store-like.service';

import { Platform } from 'ionic-angular';

import { DataService } from '../../services/data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
declare var google: any;

@Component({
  selector: 'page-store',
  templateUrl: 'store.html'
})
export class StorePage {
  stores:Array<Store> = [];
  likes:Array<Store> = [];
  baits:Array<Bait> = [];
  filter: any = {};
  loading: any;
  totalStoreCount: number = 0;
  countSelectedStores: number = 0;
  displayType:string = "list";
  infiniteScroll:any;
  @ViewChild('mapCanvas') mapElement: ElementRef;

  constructor(
    public loadingCtrl: LoadingController, 
    public mdlController:ModalController, 
    public navCtrl: NavController, 
    protected dataService: DataService, 
    protected dict: DictionaryService,
    protected storeLikeService: StoreLikeService) {
    this.initFilter();
    this.fetchBaits();
    this.fetchStores();
  }
  
  ionViewWillEnter(){
    this.fetchLikes(true);
  }
  loadMore(infiniteScroll){
    this.infiniteScroll = infiniteScroll;;
    this.filter._page +=1;
    this.fetchStores();
  }
  fetchBaits(){
    this.dict.get('bait').subscribe((res: any)=>{
      this.baits = res;
    });
  }

  onInput($event){
    this.filter.term = $event.target.value;
    this.fetchStores(true);
  }

  onCancel($event){
    delete this.filter.term
    this.fetchStores(true);
  }

  private fetchLikes(init: Boolean = false) {
    this.storeLikeService
    .getAll().subscribe((result)=>{
      if (init){
        this.likes = [];
      }
      
      result.getMember().forEach((store)=>{
        this.likes.push(store);
      });
    });
  }

  private fetchStores(init: Boolean = false) { 
    if (!this.infiniteScroll){
      this.presentLoadingDefault();
    }
    
    this.dataService
    .getCollection(new Store(), this.filter)
    .debounceTime(5000)
    .subscribe((result)=>{
      if (init){
        this.stores = [];
      }
      this.totalStoreCount = result.getTotalItem();
      
      result.getMember().forEach((store)=>{
        this.stores.push(store);
      });
      this.initMap();
      if (!this.infiniteScroll){
        this.loading.dismiss();
      }else{
        this.infiniteScroll.complete();
      }
    });
  }

  hasMore(){
    return this.totalStoreCount > this.stores.length;
  }
  
  isFiltredBait(id){
    if(!this.filter.baits){
      return false;
    }
    return this.filter.baits.indexOf(id) != -1;
  }
  
  toggleBait(id){
    if (this.isFiltredBait(id)) {
      this.removeBait(id);
    }else {
      this.addBait(id);
    }
    this.fetchStores(true);

  }

  addBait(id){
    if(!this.filter.baits){
      this.filter.baits = [];
    }
    return this.filter.baits.push(id);
  }
  
  removeBait(id){
    return this.filter.baits.splice(this.filter.baits.indexOf(id), 1);
  }

  toggleLike(store: Store){
    this.storeLikeService.toggle(store).subscribe(()=>{
      this.fetchLikes(true);
    });
  }

  public hasLike(store: Store){
    return this.likes.findIndex((el: any)=>{
      return el.id == store.id;
    }) != -1;
  }

  private initFilter() {
    this.filter = {_page: 1 ,_limit: 10};
    this.totalStoreCount = 0;
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

  initMap() {
    let mapEle = this.mapElement.nativeElement;

      let map = new google.maps.Map(mapEle, {
        center: new google.maps.LatLng(36.81897, 10.16579),//Tunis
        zoom: 10
      });

      this.stores.forEach((store: any) => {
        if(store.latitude && store.longitude){
          let infoWindow = new google.maps.InfoWindow({
            content: `<h5>${store.fullname}</h5>`
          });

          let marker = new google.maps.Marker({
            position: {
              lat: parseInt(store.latitude),
              lng: parseInt(store.longitude) 
            },
            map: map,
            title: store.fullname
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }

      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
  }
  
  setDisplayType(displayType) {
    this.displayType = displayType;
  }
}
