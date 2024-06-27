import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { PaymentGatewayData, PAYMENT_GATEWAYS } from '../../constants/payment-gateways.constants';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalType } from '../../interfaces/shared.interface';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-plans-order-payment-modal',
  templateUrl: './plans-order-payment-modal.component.html',
  styleUrls: ['./plans-order-payment-modal.component.scss']
})
export class PlansOrderPaymentModalComponent implements OnChanges {

  constructor(private authService: AuthService, private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.isOrderDetails)
  
    // console.log(this.isPaymentDetails)
  }

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onContinue: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
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

  paymentGateways: PaymentGatewayData[] = PAYMENT_GATEWAYS;
  selectedGateway: any; // Added this variable to hold the selected payment gateway
  selectedIndex: number | null = null;
  @Input() isOrderSummary: any
  @Input() isPaymentGatewayUi: any;
  @Input() isPaymentDetails: any
  @Input() isOrderDetails: any;

  // async getIpAddress() {
  //   const response = await fetch('https://api.ipify.org?format=json');
  //   const data = await response.json();
  //   return data.ip;
  // }

  // This gets the user agent from the browser
  // userAgent: any = navigator.userAgent;

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
    this.isOrderSummary = false;
    this.isPaymentGatewayUi = true;
  }

  continue() {
    if (this.selectedGateway) {
      this.onContinue.emit(this.selectedGateway.name);
      // this.createOrder(this.selectedGateway.name);
    } else {
      alert('Please select a payment gateway');
    }
    this.closePopup();
  }

  onSelect(index: number): void {
    this.selectedIndex = index; // Updating the selected index here
    this.selectedGateway = this.paymentGateways[index]; // Updating the selected payment gateway
  }

  // responseHandler(txn: any) {
  //   console.log("Transaction response =", txn.encrypted_response);
  //   console.log("Transaction response =", txn);
  //   console.log("callback received status:: ", txn.status);
  //   console.log("callback received response:: ", txn.response);
  // };


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

  closePopup() {
    this.selectedIndex = null; // Reseting selectedIndex to null
    this.selectedGateway = null; // Reseting selectedGateway to null
    this.isOrderSummary = false;
    this.isPaymentGatewayUi = false;
    this.isPaymentDetails = false;
    this.isOrderDetails = false;
    this.onClose.emit();
  }

  /**
      * Open modal.
      *
      * @param {ModalType} modalType
      * @param {string} [message = ""]
      * @param {string} [title = ""]
      * @returns {void}
      */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    // this.referrralComponent.showReferrelRow = true;
    this.modal.cancel();
  }

  calculateTotal(): { total: number; gst: number } {
    if (this.selectedPackage) {
      const packageAmount = parseFloat(this.selectedPackage.amount);

      // GST calculation
      // const gst = (18 / 100) * packageAmount;

      const gst = 0;

      // Total amount calculation
      const totalAmount = packageAmount + gst;

      return { total: totalAmount, gst: gst };
    }

    return { total: 0, gst: 0 };
  }

}
