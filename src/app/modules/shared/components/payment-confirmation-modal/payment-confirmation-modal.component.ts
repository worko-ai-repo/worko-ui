import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-confirmation-modal',
  templateUrl: './payment-confirmation-modal.component.html',
  styleUrls: ['./payment-confirmation-modal.component.scss']
})
export class PaymentConfirmationModalComponent implements OnChanges {
  @Input() decryptedPaymentResponse: any;
  amount: any;
  transactionId: any;
  orderId: any;
  successStatus: boolean = false;
  failureStatus: boolean = false;
  orderIdPart1: string = '';
  orderIdPart2: string = '';

  constructor(private router: Router, private location: Location, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
 

    if (this.decryptedPaymentResponse) {
      // console.log(this.decryptedPaymentResponse);
      this.createPaymentSummary(this.decryptedPaymentResponse);
    }
  }

  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<any>();
  @Output() onNext = new EventEmitter<any>();
  @Input() selectedPackage: any;
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
  @Input() isOrderSummary: any
  @Input() isPaymentDetails: any
  @Input() isOrderDetails: any;

  createPaymentSummary(response: any) {

    if (response.status === 'captured') {
      this.successStatus = true;
      this.amount = `₹${(response?.amount / 100).toFixed(2)}`;
      this.transactionId = response?.id;
      this.orderId = response?.order_id;
    }
    else if (response?.transaction_error_type === 'success') {
      // this.transactionId = response.id;
      // this.orderId = response.order_id;
      this.successStatus = true;
      this.amount = `₹${(response?.amount)}`;
      this.transactionId = response?.transactionid;
      // this.orderId = response?.orderid;
      this.splitOrderId(response?.orderid);
    }
    else if (response?.status === 'failed' || response?.error_code !== null || response?.transaction_error_type === 'payment_processing_error') {
      this.failureStatus = true;
    }

  }

  splitOrderId(orderId: string): void {
    const midpoint = Math.ceil(orderId.length / 2);
    this.orderIdPart1 = orderId.substring(0, midpoint);
    this.orderIdPart2 = orderId.substring(midpoint);
  }

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
   
  }

  formatCardNumber(cardNumber: string): string {
    // Replace all characters except the last four with '*'
    const maskedPart = cardNumber.slice(0, -4).replace(/./g, '*');
    // Keep the last four characters as they are
    const visiblePart = cardNumber.slice(-4);
    // Insert a space every 4 characters in the masked part
    const maskedWithSpaces = maskedPart.replace(/(.{4})/g, '$1 ');
    // Combining the masked part with spaces and the visible part
    return `${maskedWithSpaces} ${visiblePart}`;
  }

  editPaymentDetails() {
    this.isOrderSummary = false;
    this.isPaymentDetails = true;
    this.isOrderDetails = false;
  }

  nextBtn() {
    this.onNext.emit();
    this.successStatus = false;
    this.failureStatus = false;

    this.isOrderSummary = false;
    this.isPaymentDetails = true;
    this.isOrderDetails = false;
    this.decryptedPaymentResponse = null;

    // this.reloadCurrentRoute();


    // // Navigate to the same URL to force a reload
    // this.router.navigateByUrl('/candidate/subscription', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/candidate/subscription']);
    // });

    // this.router.navigate(['/candidate/subscription']).then(() => {
    //   window.location.reload();
    // });
    // this.onNext.emit();
  }

  retryBtn() {
    this.onNext.emit();
    this.successStatus = false;
    this.failureStatus = false;
    this.decryptedPaymentResponse = null;

    // this.reloadCurrentRoute();
    // this.onRetry.emit();
  }

  reloadCurrentRoute() {
    this.location.replaceState('/candidate/subscription');
    window.location.reload();
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

    this.decryptedPaymentResponse = null;
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
