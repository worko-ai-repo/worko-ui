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
 
  @HostListener('window:message', ['$event'])
  onMessage(e: { origin: string; data: any; }) {
    //debugger 
    console.log(e.data);
    if (e.origin === environment.crossOriginUrl) { console.log("afasfaasffafafaa");
      localStorage.setItem('crossDomainData', e.data);
    } 
  }


  
  
}
