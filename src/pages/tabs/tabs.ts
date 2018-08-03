import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { StorePage } from '../store/store';
import { StoreLikePage } from '../store/like';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StorePage;
  tab2Root = StoreLikePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
