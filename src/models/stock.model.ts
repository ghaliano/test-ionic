import { Store } from './store.model';
import { Bait } from './bait.model';

export class Stock{
  id: number;
  price: string;
  bait: Bait;
  store: Store
  active: Boolean

  createdAt: Date;
  updatedAt: Date;

  getCollectionUri(){
    return 'stocks';
  }

  getItemUri(){
    return 'stocks/' + this.id;
  }
}
