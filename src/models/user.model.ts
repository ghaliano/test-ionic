export class User{
  id: number;
  email: string;
  password: string;
  '@type': string = "User";
  
  getCollectionUri(){
    return 'users';
  }

  getItemUri(){
    return 'users/' + this.id;
  }
}