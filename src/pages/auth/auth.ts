import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models';
import { LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-auth',
  templateUrl: './auth.html',
  styles:['auth.scss']
})
export class AuthPage {
  authType:string = 'login';
  errorMsg: string = 'من فضلك أعد التثبت في البيانات';
  hasError: Boolean = false;
  user: User = new User();
  title = '';
  loader:any;

  constructor(
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
  } 

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "جاري التثبت"
    });
    this.loader.present();
  }

  onSubmit() {
    this.presentLoading();
    this.hasError = false;
    this.auth.login({email: this.user.email, password: this.user.password}).subscribe((coreUser) => {
      this.loader.dismiss();
      this.events.publish('user:signin:success', coreUser);
      this.hasError = false;
    }, (err: any) => {
      this.loader.dismiss();
      this.hasError = true;
    });
  }
}