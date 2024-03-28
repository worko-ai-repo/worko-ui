import { Component } from '@angular/core';

@Component({
  selector: 'app-home-faq',
  templateUrl: './home-faq.component.html',
  styleUrls: ['./home-faq.component.scss']
})
export class HomeFaqComponent {

  activeTab: string = 'tab1';

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

}
