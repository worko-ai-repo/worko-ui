import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../modal/modal.component';
import { PaymentFlowConfig } from 'src/app/modules/shared/interfaces/payment-flow-config.interface';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentGateway } from 'src/app/modules/shared/enums/payment-gateway.enum';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

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

interface PaymentResponse {
  orderTxn: any;
  processRes: any;
}


@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})

export class SubscriptionPlanComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() subscriptionList: any;
  @Input() cardDetails: any;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  filteredPackages: any;
  selectedData: any;
  isFormValid: boolean = false;
  isPaymentDetails!: boolean
  isOrderDetails!: boolean;

  selectedPackage: any;
  isOrderSummary!: boolean;
  isPaymentGatewayUi!: boolean;
  pGatewayProvider: any;
  userId: any;
  flow_config: PaymentFlowConfig | null = null;
  decryptedPaymentResponse: any;

  constructor(private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document, private spinner: NgxSpinnerService, private candServ: CandidateProfileService, private storage: StorageService) { }
  // constructor(private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.storage.get("userId");
  }

  ngOnChanges(): void {
    // console.log(this.subscriptionList);
    if (this.subscriptionList) {
      this.filteredPackages = this.subscriptionList.filter((pkg: any) => pkg.name !== "Free");

      // Sort the filtered packages by the desired order: Basic, Classic, Premium
      let sortedPackages = this.filteredPackages.sort((a: any, b: any) => {
        const order: Record<string, number> = { "Basic": 1, "Classic": 2, "Premium": 3 };
        return order[a.name as keyof typeof order] - order[b.name as keyof typeof order];
      });

      this.filteredPackages = sortedPackages.slice(0, 3);

      // console.log( this.filteredPackages);
    }
  }

  openCheckout(packageData: any) {
    this.isOrderSummary = true;
    this.isPaymentGatewayUi = false;
    this.selectedPackage = packageData;

    this.isPaymentDetails = false;
    this.isOrderDetails = false;
    // this.openModal(ModalType.SUBSCRIPTION_CHECKOUT);
    this.openModal(ModalType.PLANS_ORDER_PAYMENT);
  }
  cancel() {
    this.modal.cancel();
  }
  paynow() {
    // this.openModal(ModalType.PLANS_ORDER_PAYMENT);

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
      "returnUrl": "https://app.worko.ai/candidate/pgresponse/${this.pGatewayProvider}",
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

  handleResponseBillDesk(response: any) {
    const createOrderResponse = response;
    this.flow_config = {
      merchantId: createOrderResponse?.userOrderResponse?.pgatewayOrderResponse?.mercid,
      bdOrderId: createOrderResponse?.userOrderResponse?.pgatewayOrderResponse?.bdorderid,
      authToken: createOrderResponse?.userOrderResponse?.pgatewayOrderResponse?.links[1]?.headers?.authorization,
      childWindow: true,
      returnUrl: null,
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
        console.log("payment response received in responseHandler is == ", resCallback);
        this.processPayment(createOrderResponse, resCallback);
      }

      if (resCallback.txnResponse) {
        // const encodedRes = btoa(JSON.stringify(resCallback));
        console.log('Payment successful, encoded response received: ', resCallback?.txnResponse?.transaction_response);
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
        console.log("payment response received in handler is == ", paymentResponse);
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
    this.spinner.show();

    const paymentData = {
      userId: createOrderResponse?.gatewayOrderRequestPlainBody?.notes?.userId,
      orderType: createOrderResponse?.userOrderResponse?.orderType,
      orderId: createOrderResponse?.userOrderResponse?.orderId,
      orderTxnId: createOrderResponse?.userOrderResponse?.orderTxnId,
      // pgatewayOrderId: createOrderResponse?.userOrderResponse?.pgatewayOrderId,
      pgatewayProvider: createOrderResponse?.userOrderResponse?.pgatewayProvider,
      pgResponse: paymentResponse,
    };

    await this.candServ.processPayment(paymentData, createOrderResponse?.userOrderResponse?.orderId, createOrderResponse?.gatewayOrderRequestPlainBody?.notes?.userId).then(async (response) => {
      if (response) {
        // Assert the type of response
        const paymentResponse = response as unknown as PaymentResponse;
        if(this.pGatewayProvider == "RAZORPAY")
        {
          this.decryptedPaymentResponse = paymentResponse?.processRes?.pgResponseDecrypted;
        }
        console.log("Processed response from backend = ", response);
        this.spinner.hide();
        this.openModal(ModalType.PAYMENT_CONFIRMATION);
        if(this.showModal === this.modalType.PAYMENT_CONFIRMATION) {
          console.log("Yes payment confirmation popup should open");
        }
      }
    }).catch((error: any) => {
      this.spinner.hide();
      console.log(error);
    }
    );
  }

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

  showErrorPanel(message: string) {
    // We cam implement our logic to show an error panel or modal with the provided message
    console.error(message);
  }

}