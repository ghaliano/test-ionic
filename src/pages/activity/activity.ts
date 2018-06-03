import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserPillarLocalService } from '../../services/user-pillar-local.service';
import { DataService } from '../../services/data.service';
import { Pillar, UserActivity } from '../../models';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html'
})
export class ActivityPage {
  pillar: Pillar = new Pillar();

  constructor(
    public navCtrl: NavController, 
    private userPillarService: UserPillarLocalService,
    private dataService: DataService,
    public navParams: NavParams
  ) {
    this.pillar = this.navParams.get('pillar');
  }

  onChange($event, activity){
    activity.uiChecked = true;
    this.dataService.postItem(new UserActivity(), {activity: activity.id}).subscribe((res)=>{
    this.userPillarService.savePillarActivity(this.pillar.id, activity);
    }, (err)=>{
      activity.uiChecked = false;
    });
  }
}