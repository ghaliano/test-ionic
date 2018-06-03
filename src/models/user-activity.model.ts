export class UserActivity{
  id: number;
  activity: string;
  createdAt: Date;

  getCollectionUri(){
    return 'user-activities';
  }

  getItemUri(){
    return 'user-activities/' + this.id;
  }
}