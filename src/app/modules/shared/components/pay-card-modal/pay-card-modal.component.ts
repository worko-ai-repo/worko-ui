import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';



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
month:number=0;
year:number=0;
isCardNumberValid: boolean = true;
 cardholderName: any;
 cardholderNumber:any;
 validYear:any;
 CVV:any;
 billingaddress:any;
 zipCode:any;
 city:any;

  createCard(form:any){
    // if (!this.isValidCardNumber(this.cardholderNumber)) {
    //   // If the card number is invalid, prevent form submission
    //   return ;
    // }
    this.cardDetails={
      cardHolderName:this.cardholderName,
      cardholderNumber:this.cardholderNumber,
    validYear:this.validYear,
    CVV:this.CVV,
    billingaddress:this.billingaddress,
    zipcode:this.zipCode,
    city:this.city

    }
     
  }


  paynow(){
  
 this.onSuccess.emit();
  }



  onCardNumberChange(cardholdernum: any) {
    cardholdernum.control.setValidators([
      this.cardValidator(),
      Validators.required 
    ]);
  }
  
  cardValidator(): ValidatorFn {
    //debugger
    return (control: AbstractControl): ValidationErrors | null => {
      const cardNumber = control.value;
      
      if (!cardNumber) {
        return {require:true}; 
      }
      if (cardNumber.length < 16) {
        return { minlength: true }; 
      }
  
      if (!this.luhnCheck(cardNumber)) {
        return { card: true }; 
      }
  
      return null; 
    };
  }
  
  luhnCheck(num: string): boolean {
    let arr = num.split("").reverse().map(Number);
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
  }


pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();

    const requiredError = Validators.required(control);
    if (requiredError !== null) {
      return {required: true};
    }
    const enteredDateParts = control.value.split('/');
    
    // Check if the entered date is in the past
    if (enteredDateParts.length === 2) {
      const enteredMonth = parseInt(enteredDateParts[0], 10);
      const enteredYear = parseInt(enteredDateParts[1], 10);
      
      if (enteredYear < currentDate.getFullYear() || 
          (enteredYear === currentDate.getFullYear() && enteredMonth < currentDate.getMonth() + 1)) {
        return { pastDate: true }; 
      }
    } else {
      return { invalidFormat: true }; 
    }

    return null; 
  };
}
setPastMonthRestriction(validyears: NgModel) {
  validyears.control.setValidators([
    this.pastDateValidator(),
    validyears.control.validator || (() => null) 
  ]);
  validyears.control.updateValueAndValidity();
}





}
