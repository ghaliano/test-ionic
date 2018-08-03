import { Stock } from './stock.model';
import { User } from './user.model';

export class Store{
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  phone: string;
  user: User;
  stocks: Array<Stock>;

  uiChecked: Boolean = false;
  uiLiked: Boolean = false;
  '@type': string = "Store";
  
  getCollectionUri(){
    return 'stores';
  }

  getItemUri(){
    return 'stores/' + this.id;
  }
}