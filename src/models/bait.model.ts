export class Bait{
  id: number;
  name: string;
  picture: string;
  uiChecked: Boolean = false;
  '@type': string = "Bait";

  getCollectionUri(){
    return 'baits';
  }

  getItemUri(){
    return 'baits/' + this.id;
  }

  getImagePath(){
    return "assets/imgs/"+this.picture;
  }
}