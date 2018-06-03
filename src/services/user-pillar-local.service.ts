import { Injectable } from '@angular/core';
import { Activity, Pillar, HydraCollection } from '../models';
import { Storage } from '@ionic/storage';
import { DictionaryService } from './dictionary.service';
import { ObjectService } from './object.service';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import 'rxjs/Rx';
import moment from 'moment';
moment.locale('fr');

@Injectable()

export class UserPillarLocalService{
  public todayKey: string;
  public today: string;

  constructor(private storage: Storage,
  private events: Events,
  private dict: DictionaryService,
  private objectService: ObjectService) { 
    this.setTodayKey();
  }

  initUserPillars(){
    return Observable.forkJoin(
      this.dict.get('pillar').map(pillars => pillars),
      this.dict.get('activity').map(activities => activities)
    ).map(
      data => {
        let pillars:any = data[0];
        let activities:any = data[1];
        
        let p: Array<Pillar> = [];

        pillars.forEach((pillar)=>{
          pillar["@type"] = "Pillar";
          pillar.activities = [];


          activities.forEach((activity)=>{
            if (activity.pillar == pillar.id){
              pillar.activities.push(this.objectService.hydrateFromApi(new Activity(), JSON.stringify(activity)));
            }
          })
          
          p.push(this.objectService.hydrateFromApi(pillar, JSON.stringify(pillar)));
        })
        let hydra = new HydraCollection();
        hydra['hydra:member'] = p;
        this.savePillars(hydra);
        return Observable.of(true);
      },
      err => console.error(err)
    );
  }
  
  hasPillars() {
    return this.storage.get(this.todayKey).then((pillars) => {
      return pillars !== null;
    });
  }
  
  removePillars() {
    this.storage.remove(this.todayKey);
  }
  
  getPillars() {
    return this.storage.get(this.todayKey).then((pillars) => {
      let hydra = new HydraCollection();

      return pillars !== null ?this.objectService.hydrateFromApi(hydra, pillars):hydra;
    });
  }
  
  savePillars(pillars) { 
    this.storage.set(this.todayKey, JSON.stringify(pillars));
  }
  
  savePillar(pillars) { 
    this.storage.set(this.todayKey, JSON.stringify(pillars));
  }
  
  savePillarActivity(pillarId, activity) { 
    this.getPillars().then((res)=>{
      let pillars = res.getMember();
      let pillarIndex = pillars.findIndex(pillar=>pillar.id==pillarId);
      let activityIndex = pillars[pillarIndex].activities.findIndex(a=>a.id==activity.id);
      pillars[pillarIndex].activities[activityIndex] = activity;
      res.member = pillars;

      this.savePillars(res);
    })
  }

  getTodayKey(){
    return 'user-pillars-' + moment().format('DD-MMMM-YYYY');
  }

  setTodayKey(){
    this.todayKey = this.getTodayKey();
    this.today = moment().locale('ar-tn').format('dddd DD MMMM YYYY');
  }
} 