import { Component } from '@angular/core';

@Component({
  selector: 'app-pay-card-modal',
  templateUrl: './pay-card-modal.component.html',
  styleUrls: ['./pay-card-modal.component.scss']
})
export class PayCardModalComponent {

form:any;
 cardholderName: any;
 cardholderNumber:any;
 validyear:any;
 CVV:any;

  createCard(){
    
console.log(this.cardholderName)
  }
}
