import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { StorePage } from '../pages/store/store';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StoreLikePage } from '../pages/store/like';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MomentDatePipe} from '../pipes/moment/moment-date';
import { MomentTimeAgoPipe} from '../pipes/moment/moment-time-ago';


import { ApiHelperService } from '../services/api.helper.service';
import { DictionaryService } from '../services/dictionary.service';
import { DataService } from '../services/data.service';
import { ObjectService } from '../services/object.service';
import { RequestInterceptor } from '../services/request.interceptor';

import { StringService } from '../services/string.service';
import { StoreLikeService } from '../services/store-like.service';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { IonicStorageModule } from '@ionic/storage';
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
    StorePage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    StoreLikePage,
    MomentDatePipe,
    MomentTimeAgoPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StorePage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    StoreLikePage
  ],
  providers: [
    DictionaryService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    StoreLikeService,
    ApiHelperService,
    DictionaryService,
    DataService,
    StringService,
    AuthenticationService,
    TokenService,
    ObjectService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
