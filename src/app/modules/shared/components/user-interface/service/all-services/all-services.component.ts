import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent {
  @Input() servicesList: any;
  @Output() statusSelected = new EventEmitter<string>();
  @Output() showSelectedService = new EventEmitter<string>();


  awaitingList:  any = "";
  acceptedList:  any = "";
  rejectedList: any = "";
  doneList: any = "";
  paymentDueList: any = "";
  cancelledList: any = "";
  currentAccordion: string | null = null;
  accordionSelected: any;


  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
   
    if(this.accordionSelected == "AWAITING" &&  this.awaitingList.length === 0){
      this.awaitingList = this.servicesList;
    }
    if(this.accordionSelected == "ACCEPTED" &&  this.acceptedList.length === 0){
      this.acceptedList = this.servicesList;
    }
    if(this.accordionSelected == "REJECTED" &&  this.rejectedList.length === 0){
      this.rejectedList = this.servicesList;
    }
    if(this.accordionSelected == "DONE" &&  this.doneList.length === 0){
      this.doneList = this.servicesList;
    }
    if(this.accordionSelected == "PAYMENT_DUE" &&  this.paymentDueList.length === 0){
      this.paymentDueList = this.servicesList;
    }
    if(this.accordionSelected == "CANCELLED" &&  this.cancelledList.length === 0){
      this.cancelledList = this.servicesList;
    }
    this.currentAccordion = (this.currentAccordion === this.accordionSelected) ? null : this.accordionSelected;
    this.showSelectedService.emit(this.servicesList ? this.servicesList[0]: "");
  }

  // onSelectStatus(status: string): void {
  //   this.selectedStatus = status;
  //   this.statusSelected.emit(status);

  // }
  toggleAccordion(accordionType: string) {
    // Toggle the accordion
    this.accordionSelected = accordionType;
    // if( this.accordionSelected === "AWAITING" &&  this.awaitingList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return;
    // } else if( this.accordionSelected === "ACCEPTED" &&  this.acceptedList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return;
    // } else if( this.accordionSelected === "REJECTED" &&  this.rejectedList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return;
    // } else if( this.accordionSelected === "DONE" &&  this.doneList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return; 
    // } else if( this.accordionSelected === "PAYMENT_DUE" &&  this.paymentDueList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return; 
    // } else if( this.accordionSelected === "CANCELLED" &&  this.cancelledList.length > 0){
    //   this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
    //   return; 
    // }else{
    //   this.statusSelected.emit(accordionType);
    // }
    this.statusSelected.emit(accordionType);
    // this.currentAccordion = (this.currentAccordion === accordionType) ? null : accordionType;
  }

  showServiceData(item:any){
   
    this.showSelectedService.emit(item);

  }
  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }

}
