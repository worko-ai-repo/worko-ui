import { Component } from '@angular/core';

@Component({
  selector: 'app-request-guidence',
  templateUrl: './request-guidence.component.html',
  styleUrls: ['./request-guidence.component.scss']
})
export class RequestGuidenceComponent {
  isDivOpen:boolean=true;
  reqGuidenceArray:any[]=[];
  // showDiv:boolean=false;
  // showDiv1:boolean=true;
  // showDiv2:boolean=true;
  // showDiv3:boolean=true;
  selectedService: string = '';
  serviceButtonHide : boolean = true;
  isFormVisible: boolean = false;


  selectService(service: string) {
    this.selectedService = service;
    this.isFormVisible = true;

  }



 
//   toggleDiv() {
//     this.showDiv = !this.showDiv;
//   }
// toggleDiv1() {
//   this.showDiv1 = !this.showDiv1;
//   }
// toggleDiv2() {
//   this.showDiv2 = !this.showDiv2;
//   }
// toggleDiv3() {
//   this.showDiv3 = !this.showDiv3;
//   }

 }
