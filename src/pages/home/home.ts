import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserPillarLocalService } from '../../services/user-pillar-local.service';
import { Pillar, HydraCollection } from '../../models';
import { ActivityPage } from '../activity/activity'; 
import moment from 'moment';
import {  MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pillars: Array<Pillar> = [];
  today:string;

  constructor(
    public navCtrl: NavController, 
    private userPillarLocalService: UserPillarLocalService,
    public menu: MenuController,
    private toastCtrl: ToastController,
    private events: Events
  ) {
    menu.enable(true);
    this.loadDictionaries();
    this.today = this.userPillarLocalService.today;
    this.events.subscribe('day:changed', (changed) => {
      this.loadDictionaries(true);
      console.log('day:changed event catched !');
    })
  }

  loadDictionaries(init:Boolean=false){
    this.userPillarLocalService.getPillars().then((pillars: HydraCollection)=>{
      if (init){
        this.pillars = [];
      }
      if (!pillars.getMember().length){
        this.loadDictionaries(true);
      }else{
        pillars.getMember().forEach((pillar)=>{
          this.pillars.push(pillar);
        });
      }
    })
  }

  gotoActivity(pillar: Pillar) {
     this.navCtrl.push(ActivityPage, {pillar: pillar});
  }

  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
  
  remove(){
    this.userPillarLocalService.removePillars();
  }

  public start(){
    this.userPillarLocalService.todayKey = 'user-pillars-' + moment().add(1, 'd').format('dddd-MMMM-YYYY');
    this.userPillarLocalService.today = 'user-pillars-' + moment().add(1, 'd').format('dddd-MMMM-YYYY');
    //this.remove();
    /*this.userPillarLocalService.hasPillars().then((hasPillar)=>{
      if (!hasPillar){
        this.userPillarLocalService
        .initUserPillars()
        .subscribe((res)=>{
          this.loadDictionaries();
        });
      } else {
        this.presentToast("عفوا، لا يمكنك بداية  يوم جديد");
      }
    })*/
  }
}