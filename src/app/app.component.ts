import { Component,HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { environment } from 'src/environment/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'worko-ui';

  constructor(

    private spinner: NgxSpinnerService,
  
  ) {}
 
  // @HostListener('window:message', ['$event'])
  // onMessage(e: { origin: string; data: any; }) {
  //   debugger 
  //   console.log(e.data);
  //   if (e.origin === environment.crossOriginUrl) { 
  //     localStorage.setItem('crossDomainData', e.data);
  //   } 
  // }
  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent) {
    debugger;
    console.log('Message received:', e.data, 'from origin:', e.origin);
    if (e.origin === environment.crossOriginUrl) {
      console.log('Setting crossDomainData in localStorage:', e.data);
      localStorage.setItem('crossDomainData', e.data);
    } else {
      console.error('Origin mismatch. Expected:', environment.crossOriginUrl, 'but got:', e.origin);
    }
  }

  
  
}
