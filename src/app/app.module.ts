import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { ActivityPage } from '../pages/activity/activity';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiHelperService } from '../services/api.helper.service';
import { DictionaryService } from '../services/dictionary.service';
import { DataService } from '../services/data.service';
import { ObjectService } from '../services/object.service';
import { RequestInterceptor } from '../services/request.interceptor';

import { StringService } from '../services/string.service';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';

import { UserPillarLocalService } from '../services/user-pillar-local.service';
import { IonicStorageModule } from '@ionic/storage';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgCircleProgressModule } from 'ng-circle-progress';

class MyErrorHandler extends ErrorHandler {
    constructor(){
      super();
    }

    handleError(err: any){
      console.log(err);
    }
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ActivityPage,
    AuthPage
  ],
  imports: [
    BrowserModule,
    NgCircleProgressModule.forRoot({
      backgroundStrokeWidth: 0,
      backgroundPadding: 0,
      radius: 20,
      space: -4,
      outerStrokeWidth: 4,
      outerStrokeColor: "#4882c2",
      outerStrokeLinecap: "square",
      innerStrokeColor: "#e7e8ea",
      innerStrokeWidth: 4,
      animateTitle: false,
      animationDuration: 250,
      showTitle: false,
      showUnits: false,
      showBackground: false,
      clockwise: false,
      titleFontSize: '10',
      unitsFontSize: '10',
      subtitleFontSize: '18'
    }),
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ActivityPage,
    AuthPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiHelperService,
    DictionaryService,
    DataService,
    UserPillarLocalService,
    StringService,
    AuthenticationService,
    TokenService,
    ObjectService,
    //{provide: ErrorHandler, useClass: MyErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
