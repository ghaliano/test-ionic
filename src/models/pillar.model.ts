import {Activity} from './activity.model';
export class Pillar{
  id: number;
  name: string;
  icon: string;  
  image: string;  
  activities: Array<Activity> = [];  
  uiChecked: Boolean = false;
  '@type': string = "Pillar";

  getCollectionUri(){
    return 'pillars';
  }

  getItemUri(){
    return 'pillars/' + this.id;
  }

  getProgressPercent(unit:Boolean=false){
    if (!this.activities.length){
      return 0;
    }

    let percent:any = Math.ceil((this.activities.filter(activity=>activity.uiChecked).length/this.activities.length)*100);
    if (unit){
      percent = percent.toString()+" %";
    }

    return percent;
  }

  getImagePath(){
    return "assets/imgs/"+this.image;
  }
}