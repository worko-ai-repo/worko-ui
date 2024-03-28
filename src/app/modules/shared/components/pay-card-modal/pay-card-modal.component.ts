import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { Validators } from '@angular/forms';



@Component({
  selector: 'app-pay-card-modal',
  templateUrl: './pay-card-modal.component.html',
  styleUrls: ['./pay-card-modal.component.scss']
})
export class PayCardModalComponent {
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() cardDetails:any={
    cardHolderName:"",
  cardholderNumber:"",
  validYear:"",
  CVV:"",
  billingaddress:"",
  zipCode:"",
  city:""

  }
form:any={
  cardHoldername:"",
  cardholdernumber:"",
  validyear:"",
  cardCVV:"",
  billingaddress:"",
  zipcode:"",
  city:""
};
currentYear = new Date().getFullYear().toString();
currentMonth = (new Date().getMonth() + 1).toString();
maxDate =  (this.currentMonth.length === 1 ? '0' + this.currentMonth : this.currentMonth) + "/"+this.currentYear  ;


 cardholderName: any;
 cardholderNumber:any;
 validYear:any;
 CVV:any;
 billingaddress:any;
 zipCode:any;
 city:any;

  createCard(form:any){
    
    this.cardDetails={
      cardHolderName:this.cardholderName,
      cardholderNumber:this.cardholderNumber,
    validYear:this.validYear,
    CVV:this.CVV,
    billingaddress:this.billingaddress,
    zipcode:this.zipCode,
    city:this.city

    }
     

    
  
    console.log(this.cardDetails)
    
console.log(this.cardholderName)
  }


  paynow(){
  
 this.onSuccess.emit();
  }


//   setPastMonthRestriction(completionyear: any) {
//     completionyear.control.setValidators(this.validateCompletionYear(this.maxDate));
//   }

// validateCompletionYear(maxDate: string): any {
// return (control: any) => {
//   let completionYear = control.value;

//   this.month = completionYear.split('/')[0]
//   console.log(this.month)
//   console.log(completionYear)
//   console.log(this.maxDate)

//   if (!completionYear || completionYear.trim() === '') {
//     return null;
//   }

//   if (!completionYear.includes('/')) {
//     return { missingDash: true };
//   }



//   if (completionYear > maxDate || completionYear.length > 7 || this.month > 12 || this.month == 0) {
//     return { futureMonth: true };
//   }
//   return null;
// };
// }

}
