import { Component,HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { environment } from 'src/environments/environment';
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

  
  
}
