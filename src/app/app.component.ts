import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { UserPillarLocalService } from '../services/user-pillar-local.service';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  homePage:any = HomePage;
  aboutPage:any = AboutPage;
  authPage:any = AuthPage;
  isLogged:Boolean = false;

  constructor(
  platform: Platform, 
  statusBar: StatusBar, 
  splashScreen: SplashScreen,
  private authService: AuthenticationService,
  private tokenService: TokenService,
  private menuCtrl: MenuController,
  private events: Events,
  private toastCtrl: ToastController,
  private userPillarLocalService: UserPillarLocalService
  ) {
    platform.ready().then(() => {
      console.log('Platform is ready !');
      statusBar.styleDefault();
      splashScreen.hide();
      this.tokenService.refreshLiveAccessToken();
    });

    this.authService.isLogged().then((isLogged)=>{
      this.isLogged = isLogged;
      if (!isLogged){
        this.rootPage = AuthPage;
      } else {
        this.rootPage = HomePage;
      }
    })
    
    Observable.timer(0, 5000).timeInterval().pluck('interval')
     .subscribe(() => {
      if (this.isLogged && (this.userPillarLocalService.todayKey != this.userPillarLocalService.getTodayKey())){
        this.userPillarLocalService.setTodayKey();
        this.userPillarLocalService.initUserPillars().subscribe(()=>{
          this.events.publish('day:changed', true);
        })
      }
    });

    this.events.subscribe('user:signin:success', (user) => {
      this.userPillarLocalService.hasPillars().then((hasPillar)=>{
        if (!hasPillar){
          this.userPillarLocalService.initUserPillars().subscribe(()=>{
            this.rootPage = HomePage;
            this.isLogged = true;
          });
        } else {
          this.rootPage = HomePage;
            this.isLogged = true;
        }
      })
    });
    
    this.events.subscribe('user:logout:success', (res) => {
      this.rootPage = AuthPage;
      this.isLogged = true;
    });
    
    this.events.subscribe('connexion:failed', (res) => {
      this.presentToast("خلل في الإتصال بقاعدة البيانات");
    });
  }

  openPage(page){
    if (page != this.rootPage){
      this.menuCtrl.close();
      this.nav.push(page);
    }
  }

  logout(){
    this.isLogged = false;
    this.authService.logout();
    this.rootPage = AuthPage;
    this.menuCtrl.close();
  }
  

  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
}
