import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { PaymentGateway } from '../../../enums/payment-gateway.enum';
import { PaymentGatewayData, PAYMENT_GATEWAYS } from '../../../constants/payment-gateways.constants';
import { PaymentFlowConfig } from '../../../interfaces/payment-flow-config.interface';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ModalComponent } from '../modal.component';
import { ModalType } from '../../../interfaces/shared.interface';
import { NgxSpinnerService } from 'ngx-spinner';

// export const theme_config = {
//   sdkPrimaryColor: "#2F92C7",
//   sdkAccentColor: "#fffefe",
//   sdkBackgroundColor: "#57e1ff",
//   sdkBannerColor: "#061634"
// };
export const theme_config = {
  sdkPrimaryColor: "#69068a",
  sdkAccentColor: "#cf5df5",
  sdkBackgroundColor: "#f2caff",
  sdkBannerColor: "#061634"
};

declare var Razorpay: any;
@Component({
  selector: 'app-plans-order-payment-modal',
  templateUrl: './plans-order-payment-modal.component.html',
  styleUrls: ['./plans-order-payment-modal.component.scss']
})
export class PlansOrderPaymentModalComponent implements OnChanges {

  constructor(private candServ: CandidateProfileService, private authService: AuthService, private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document, private storage: StorageService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.userId = this.storage.get("userId");
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.isOrderDetails)
    console.log(this.isOrderSummary)
    console.log(this.isPaymentDetails)
  }

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
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
  orderData: any = {
    orderid: '123456', // Your unique order ID
    mercid: 'BDUATV2KTK', // Your merchant ID
    // Add other required parameters
  };

  headers: any = new HttpHeaders({
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
  flow_config: PaymentFlowConfig | null = null;
  userId: any;
  pGatewayProvider: any;
  paymentGateways: PaymentGatewayData[] = PAYMENT_GATEWAYS;
  selectedGateway: any; // Added this variable to hold the selected payment gateway
  selectedIndex: number | null = null;
  @Input() isOrderSummary: any
  @Input() isPaymentGatewayUi: any;
  @Input() isPaymentDetails: any
  @Input() isOrderDetails: any;

  async getIpAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  }

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
    // this.placeOrder();
    // this.createOrder("Billdesk")
    this.isOrderSummary = false;
    this.isPaymentGatewayUi = true;
  }

  continue(): void {
    if (this.selectedGateway) {
      this.createOrder(this.selectedGateway.name);
    } else {
      alert('Please select a payment gateway');
    }
  }

  onSelect(index: number): void {
    this.selectedIndex = index; // Updating the selected index here
    this.selectedGateway = this.paymentGateways[index]; // Updating the selected payment gateway
  }

  async createOrder(pGateway: any) {
    this.spinner.show();

    if (pGateway === 'Razorpay') {
      this.pGatewayProvider = PaymentGateway.RAZORPAY;
    }
    else {
      this.pGatewayProvider = PaymentGateway.BILL_DESK;
    }

    // const ipAddress = await this.getIpAddress();

    let subTotalAmount = this.selectedPackage?.amount || 0;
    let gstAmount = subTotalAmount * 0.18;
    let discountAmount = 0;

    let totalAmount = subTotalAmount + gstAmount - discountAmount;

    let payload = {
      "pgatewayProvider": this.pGatewayProvider,
      "subTotalAmount": subTotalAmount,
      "discountAmount": discountAmount,
      "gstAmount": gstAmount,  // GST is 18% of the subtotal amount
      "orderType": "SUBS",
      // "ipAddress": ipAddress,
      // "userAgent": this.userAgent,
      // "returnUrl": "https://app.worko.ai/candidate/billdeskresponse",
      "returnUrl": "https://app.worko.ai/candidate/subscription",
      // "returnUrl": "https://app.worko.local:4200/candidate/subscription",
      "products": [{
        "productContext": "SUBS",
        "productContextId": this.selectedPackage?.SK,
        "productContextDetails": {
          "details": this.selectedPackage?.details
        },
        "unitPrice": this.selectedPackage?.amount,
        "quantity": 1,
        "totalAmount": totalAmount
      }]

    }

    await this.candServ.createOrder(payload, this.userId).then(async (response) => {
      if (response) {
        console.log("Create Order Api Response = ", response);
        if (this.pGatewayProvider === PaymentGateway.RAZORPAY) {
          this.handleResponseRazorpay(response);
        }
        else {
          this.handleResponseBillDesk(response);
        }
        // this.spinner.hide();
      }
    }).catch((error: any) => {
      this.spinner.hide();
      console.log("Create Order API error = ", error);
    }
    );

  }

  handleResponseRazorpay(response: any) {
    this.spinner.hide();
    const createOrderResponse = response;
    let options = {
      key: "REDACTED", // Will replace it with our actual Razorpay key ID
      amount: createOrderResponse?.gatewayOrderRequestPlainBody?.amount, // Amount in paise
      currency: createOrderResponse?.gatewayOrderRequestPlainBody?.currency,
      name: "Worko Ai",
      description: this.selectedPackage?.details,
      order_id: createOrderResponse?.userOrderResponse?.pgatewayOrderId, // Razorpay order ID
      handler: (paymentResponse: any) => {
        this.processPayment(createOrderResponse, paymentResponse);
      },
      prefill: {
        name: "Customer Name",
        email: createOrderResponse?.gatewayOrderRequestPlainBody?.notes?.userEmail,
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
      console.log(response.error);
    });
    rzp1.open();
  }

  async processPayment(createOrderResponse: any, paymentResponse: any) {
    console.log("payment response received in handler is == ", paymentResponse);

    const paymentData = {
      userId: createOrderResponse?.gatewayOrderRequestPlainBody?.notes?.userId,
      orderType: createOrderResponse?.userOrderResponse?.orderType,
      orderId: createOrderResponse?.userOrderResponse?.orderId,
      OrderTxnId: createOrderResponse?.userOrderResponse?.orderTxnId,
      pgatewayOrderId: createOrderResponse?.userOrderResponse?.pgatewayOrderId,
      pgatewayProvider: createOrderResponse?.userOrderResponse?.pgatewayProvider,
      pgResponse: paymentResponse,
    };

    await this.candServ.processPayment(paymentData, createOrderResponse?.userOrderResponse?.orderId, createOrderResponse?.gatewayOrderRequestPlainBody?.notes?.userId).then(async (response) => {
      if (response) {
        console.log("Processed response from backend = ", response);
        // this.spinner.hide();
      }
    }).catch((error: any) => {
      // this.spinner.hide();
      console.log(error);
    }
    );
  }

  handleResponseBillDesk(response: any) {
    const orderTxn = response;
    this.flow_config = {
      merchantId: orderTxn?.userOrderResponse?.pgatewayOrderResponse?.mercid,
      bdOrderId: orderTxn?.userOrderResponse?.pgatewayOrderResponse?.bdorderid,
      authToken: orderTxn?.userOrderResponse?.pgatewayOrderResponse?.links[1]?.headers?.authorization,
      childWindow: false,
      // returnUrl: orderTxn?.userOrderResponse?.pgatewayOrderResponse?.ru,
      // crossButtonHandling: 'Y',
      retryCount: 0,
      // prefs: {
      //   "payment_categories": ["card", "nb"],
      //   "allowed_bins": ["459150", "525211"]
      // },
      // netBanking: {
      //   "showPopularBanks": "Y",
      //   "popularBanks": ["Kotak Bank", " AXIS Bank [Retail]"]
      // }
    };

    const responseHandler = (resCallback: any) => {
      if (resCallback) {
        console.log('responseHandler callback  = ', resCallback);
      }

      if (resCallback.txnResponse) {
        const encodedRes = btoa(JSON.stringify(resCallback));
        console.log('Payment successful, encoded response:', encodedRes);
        // We can perform any additional actions needed, such as updating the UI or sending the response to the server
      }

      if (resCallback.status === 111) {
        this.showErrorPanel('Modal Closed By User');
      }
    };

    const config = {
      responseHandler,
      flowConfig: this.flow_config,
      flowType: "payments",
      themeConfig: theme_config
    };
    this.injectBillDeskSdk(config);
  }

  showErrorPanel(message: string) {
    // We cam implement our logic to show an error panel or modal with the provided message
    console.error(message);
  }

  // responseHandler(txn: any) {
  //   console.log("Transaction response =", txn.encrypted_response);
  //   console.log("Transaction response =", txn);
  //   console.log("callback received status:: ", txn.status);
  //   console.log("callback received response:: ", txn.response);
  // };

  injectBillDeskSdk(config: any) {
    console.log("injectBillDeskSdk start =", config);

    (window as any).loadBillDeskSdk(config);
    console.log("injectBillDeskSdk end");
    this.spinner.hide();

    // // Dynamically loading ES module script
    // const esmScript = this.renderer2.createElement('script');
    // esmScript.type = 'module';
    // esmScript.src = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk/billdesksdk.esm.js';
    // this.renderer2.appendChild(this.document.body, esmScript);

    // // Dynamically loading non-module script
    // const nomoduleScript = this.renderer2.createElement('script');
    // nomoduleScript.src = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk.js';
    // this.renderer2.appendChild(this.document.body, nomoduleScript);

    // // Dynamically loading stylesheet
    // const stylesheet = this.renderer2.createElement('link');
    // stylesheet.rel = 'stylesheet';
    // stylesheet.href = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk/billdesksdk.css';
    // this.renderer2.appendChild(this.document.head, stylesheet);

    // Injecting inline script for config and initialization
    // const inlineScript = this.renderer2.createElement('script');
    // inlineScript.type = 'text/javascript';
    // inlineScript.text = `
    //   var flow_config = ${JSON.stringify(config.flowConfig)};
    //   var responseHandler = function (txn) {
    //       if (txn.response) {
    //           alert("callback received status:: " + txn.status);
    //           alert("callback received response:: " + txn.response);
    //       }
    //   };

    //   var config = {
    //       flowConfig: flow_config,
    //       flowType: "payments"
    //   };
    //   window.addEventListener('load', function () {
    //     window.loadBillDeskSdk(config);
    // });
    // `;
    // this.renderer2.appendChild(document.body, inlineScript);

    // const inlineScript = this.renderer2.createElement('script');
    // inlineScript.type = 'text/javascript';
    // inlineScript.text = `
    //   // Configuration for BillDesk SDK
    //   var flow_config = ${JSON.stringify(config.flowConfig)};
    //   var responseHandler = ${config.responseHandler};

    //   var config = {
    //     flowConfig: flow_config,
    //     flowType: "payments",
    //     responseHandler: responseHandler
    //   };

    //   // Initializing BillDesk SDK on window load
    //   window.addEventListener('load', function () {
    //     window.loadBillDeskSdk(config);
    //   });
    // `;
    // // this.renderer2.appendChild(this.document.body, inlineScript);
    // this.renderer2.appendChild(this.document.head, inlineScript); // Injecting into <head> instead of <body>
  }

  // async placeOrder() {
  //   const orderData = {
  //     orderid: 'TSSGF432f15G', // Order ID (from the sample)
  //     mercid: 'BDUATV2KTK', // Merchant ID (from the sample)
  //     amount: '300.00',
  //     order_date: '2023-07-30T20:25:00+05:30',
  //     currency: '356',
  //     ru: 'https://www.example.com/merchant/api/pgresponse',
  //     additional_info: {
  //       additional_info1: 'Details1',
  //       additional_info2: 'Details2'
  //     },
  //     itemcode: 'DIRECT',
  //     invoice: {
  //       invoice_number: 'MEINVU111111221133',
  //       invoice_display_number: '11221133',
  //       customer_name: 'John',
  //       invoice_date: '2021-09-03T13:21:50+05:30',
  //       gst_details: {
  //         cgst: '8.00',
  //         sgst: '8.00',
  //         igst: '0.00',
  //         gst: '16.00',
  //         cess: '0.00',
  //         gstincentive: '5.00',
  //         gstpct: '16.00',
  //         gstin: '12344567'
  //       }
  //     },
  //     device: {
  //       init_channel: 'internet',
  //       ip: '<customer’s ip>',
  //       user_agent: 'Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101 Firefox/51.0',
  //       accept_header: 'text/html',
  //       fingerprintid: '61b12c18b5d0cf901be34a23ca64bb19',
  //       browser_tz: '-330',
  //       browser_color_depth: '32',
  //       browser_java_enabled: 'false',
  //       browser_screen_height: '601',
  //       browser_screen_width: '657',
  //       browser_language: 'en-US',
  //       browser_javascript_enabled: 'true'
  //     },
  //   };

  //   const authorizationToken = "REDACTED";

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/jose',
  //     'Accept': 'application/jose',
  //     'bd-timestamp': '20200817132207',
  //     'bd-traceid': '20200817132207ABD1K',
  //     'Authorization': authorizationToken
  //   });

  //   try {
  //     const response = this.candServ.createOrder(orderData, headers);
  //     console.log('Order placed successfully:', response);
  //     response.then((val: any) => {
  //       console.log(val);
  //     })
  //     // Handle success
  //   } catch (error) {
  //     console.error('Error placing order:', error);
  //     // Handle error
  //   }
  // }


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

  closePopup() {
    this.selectedIndex = null; // Reseting selectedIndex to null
    this.selectedGateway = null; // Reseting selectedGateway to null
    this.isOrderSummary = true;
    this.isPaymentGatewayUi = false;
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

}
