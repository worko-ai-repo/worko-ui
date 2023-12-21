import { Component, ElementRef, Input, ViewChild } from '@angular/core';



@Component({
  selector: 'app-request-guidence',
  templateUrl: './request-guidence.component.html',
  styleUrls: ['./request-guidence.component.scss'],
  
  
})
export class RequestGuidenceComponent {
  @ViewChild('largeModal') largeModal!: ElementRef;
  @Input() selectedCompany: any;

  isDivOpen:boolean=true;
  reqGuidenceArray:any[]=[];
  isDivShow:boolean= true
  selectedService: string = '';
  serviceButtonHide : boolean = true;
  isFormVisible: boolean = false;


  selectService(service: string) {
    this.selectedService = service;
    this.isFormVisible = true;

  }
  // openLargeModal() {
   
  //   this.largeModal.nativeElement.classList.add('show');
  //   this.largeModal.nativeElement.style.display = 'block';
  // }
  // closeLargeModal() {
  //   this.largeModal.nativeElement.classList.remove('show');
  //   this.largeModal.nativeElement.style.display = 'none';
  // }



 


 }
