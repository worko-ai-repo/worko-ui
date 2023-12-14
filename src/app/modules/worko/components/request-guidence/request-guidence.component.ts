import { Component } from '@angular/core';

@Component({
  selector: 'app-request-guidence',
  templateUrl: './request-guidence.component.html',
  styleUrls: ['./request-guidence.component.scss']
})
export class RequestGuidenceComponent {
  isDivOpen:boolean=true;
  reqGuidenceArray:any[]=[];
  
  selectedService: string = '';
  serviceButtonHide : boolean = true;
  isFormVisible: boolean = false;


  selectService(service: string) {
    this.selectedService = service;
    this.isFormVisible = true;

  }



 


 }
