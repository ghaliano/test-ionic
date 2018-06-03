export class Activity{
  id: number;
  name: string;
  pillar: string;
  type: string;
  icon: string;
  uiChecked: Boolean = false;
  '@type': string = "Activity";
  
  getCollectionUri(){
    return 'activities';
  }

  getItemUri(){
    return 'activities/' + this.id;
  }
}