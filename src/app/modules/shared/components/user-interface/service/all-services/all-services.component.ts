import { Component } from '@angular/core';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent {
  serviceRequests = [
    { id: 1, title: 'Service Request', number: '#6493', date:'Dec 1 2023' },
    { id: 2, title: 'Service Request', number: '#6494', date:'Dec 5 2023' },
    { id: 3, title: 'Service Request', number: '#6495', date:'Dec 7 2023' },
    { id: 4, title: 'Service Request', number: '#6496', date:'Dec 12 2023' },
    

  ];
  currentAccordion: string | null = null;

  toggleAccordion(accordionType: string) {
    // Toggle the accordion
    this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
  }
 
}
