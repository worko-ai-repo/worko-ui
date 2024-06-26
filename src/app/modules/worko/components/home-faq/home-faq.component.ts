import { Component } from '@angular/core';

@Component({
  selector: 'app-home-faq',
  templateUrl: './home-faq.component.html',
  styleUrls: ['./home-faq.component.scss']
})
export class HomeFaqComponent {

  activeTab: string = 'tab1';
  toggleSymbols: { [key: number]: boolean } = {};
  activeIndex: number = 0;

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  

  toggleAccordion(index: number) {
   
    if (this.activeIndex === index) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = index;
    }
    this.toggleSymbols[index] = !this.toggleSymbols[index];
   
  }

}
