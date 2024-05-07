import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-plans-order-payment-modal',
  templateUrl: './plans-order-payment-modal.component.html',
  styleUrls: ['./plans-order-payment-modal.component.scss']
})
export class PlansOrderPaymentModalComponent implements OnChanges {

  constructor(private candServ:CandidateProfileService, private authService: AuthService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.isOrderDetails)
    console.log(this.isOrderSummary)
    console.log(this.isPaymentDetails)
  }

  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  @Input() selectedPackage:any;
  @Input() cardDetails: any = {
    cardHolderName: "",
    cardholderNumber: "",
    validYear: "",
    CVV: "",
    billingaddress: "",
    zipCode: "",
    city: ""

  }
  form: any = {
    cardHoldername: "",
    cardholdernumber: "",
    validyear: "",
    cardCVV: "",
    billingaddress: "",
    zipcode: "",
    city: ""
  };
  orderData:any = {
    orderid: '123456', // Your unique order ID
    mercid: 'BDUATV2KTK', // Your merchant ID
    // Add other required parameters
  };

  headers:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // Add other headers if needed
  });
  currentYear = new Date().getFullYear().toString();
  currentMonth = (new Date().getMonth() + 1).toString();
  maxDate = (this.currentMonth.length === 1 ? '0' + this.currentMonth : this.currentMonth) + "/" + this.currentYear;
  month: number = 0;
  year: number = 0;
  isCardNumberValid: boolean = true;
  cardholderName: any;
  cardholderNumber: any;
  validYear: any;
  CVV: any;
  billingaddress: any;
  zipCode: any;
  city: any;
  formattedCardNumber!: string;
  @Input() isOrderSummary:any
  @Input() isPaymentDetails:any
  @Input() isOrderDetails:any;

  createCard(form: any) {
    // if (!this.isValidCardNumber(this.cardholderNumber)) {
    //   // If the card number is invalid, prevent form submission
    //   return ;
    // }
    this.isOrderSummary = false;
    this.isPaymentDetails = false;
    this.isOrderDetails = true;

    this.cardDetails = {
      cardHolderName: this.cardholderName,
      cardholderNumber: this.cardholderNumber,
      validYear: this.validYear,
      CVV: this.CVV,
      billingaddress: this.billingaddress,
      zipcode: this.zipCode,
      city: this.city
    }

    this.formattedCardNumber = this.formatCardNumber(this.cardDetails.cardholderNumber);
    console.log(this.cardDetails)
    console.log(this.cardholderName)
  }

  formatCardNumber(cardNumber: string): string {
    // Replace all characters except the last four with '*'
    const maskedPart = cardNumber.slice(0, -4).replace(/./g, '*');
    // Keep the last four characters as they are
    const visiblePart = cardNumber.slice(-4);
    // Insert a space every 4 characters in the masked part
    const maskedWithSpaces = maskedPart.replace(/(.{4})/g, '$1 ');
    // Combine the masked part with spaces and the visible part
    return `${maskedWithSpaces} ${visiblePart}`;
  } 

  editPaymentDetails() {
    this.isOrderSummary = false;
    this.isPaymentDetails = true;
    this.isOrderDetails = false;
  }

  // payNow() {
  //   // this.isOrderSummary = false;
  //   // this.isPaymentDetails = true;
  //   // this.isOrderDetails = false;
  //   this.placeOrder();
  // }

  payNow() {
    this.placeOrder();
  }
  
  // Trace ID
  traceid = "20200817132207ABD1K";
  
  async placeOrder() {
    const orderData = {
      orderid: 'TSSGF432f15G', // Order ID (from the sample)
      mercid: 'BDUATV2KTK', // Merchant ID (from the sample)
      amount: '300.00',
      order_date: '2023-07-30T20:25:00+05:30',
      currency: '356',
      ru: 'https://www.example.com/merchant/api/pgresponse',
      additional_info: {
        additional_info1: 'Details1',
        additional_info2: 'Details2'
      },
      itemcode: 'DIRECT',
      invoice: {
        invoice_number: 'MEINVU111111221133',
        invoice_display_number: '11221133',
        customer_name: 'John',
        invoice_date: '2021-09-03T13:21:50+05:30',
        gst_details: {
          cgst: '8.00',
          sgst: '8.00',
          igst: '0.00',
          gst: '16.00',
          cess: '0.00',
          gstincentive: '5.00',
          gstpct: '16.00',
          gstin: '12344567'
        }
      },
      device: {
        init_channel: 'internet',
        ip: '<customer’s ip>',
        user_agent: 'Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101 Firefox/51.0',
        accept_header: 'text/html',
        fingerprintid: '61b12c18b5d0cf901be34a23ca64bb19',
        browser_tz: '-330',
        browser_color_depth: '32',
        browser_java_enabled: 'false',
        browser_screen_height: '601',
        browser_screen_width: '657',
        browser_language: 'en-US',
        browser_javascript_enabled: 'true'
      },
    };

    const authorizationToken = "REDACTED";
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/jose',
      'Accept': 'application/jose',
      'bd-timestamp': '20200817132207',
      'bd-traceid': '20200817132207ABD1K',
      'Authorization': authorizationToken
    });
  
    try {
      const response = this.candServ.createOrder(orderData, headers);
      console.log('Order placed successfully:', response);
      response.then((val:any)=>{
        console.log(val);
      })
      // Handle success
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error
    }
  }
  

  onCardNumberChange(cardholdernum: any) {
    cardholdernum.control.setValidators([
      this.cardValidator(),
      Validators.required
    ]);
  }

  cardValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cardNumber = control.value;

      if (!cardNumber) {
        return { require: true };
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
    console.log(sum)
    return sum % 10 === 0;
  }


  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();

      const requiredError = Validators.required(control);
      if (requiredError !== null) {
        return { required: true };
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

  //Order Summary section starts from here

  closeModal() {
    this.isOrderSummary = true;
    this.isPaymentDetails = false;
    this.isOrderDetails = false;
    this.onClose.emit();
  }

  calculateTotal(): { total: number; gst: number } {
    if (this.selectedPackage) {
      const packageAmount = parseFloat(this.selectedPackage.amount);
  
      // GST calculation
      const gst = (18 / 100) * packageAmount;
  
      // Total amount calculation
      const totalAmount = packageAmount + gst;
  
      return { total: totalAmount, gst: gst };
    }
  
    return { total: 0, gst: 0 }; 
  }

}
