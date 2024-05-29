import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../modal/modal.component';
import { PaymentFlowConfig } from 'src/app/modules/shared/interfaces/payment-flow-config.interface';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const theme_config = {
  sdkPrimaryColor: "#69068a",
  sdkAccentColor: "#cf5df5",
  sdkBackgroundColor: "#f2caff",
  sdkBannerColor: "#982cbb"
};
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
  selectedPackage: any;
  isFormValid: boolean = false;
  isOrderSummary!: boolean;
  isPaymentGatewayUi!:boolean;
  isPaymentDetails!: boolean
  isOrderDetails!: boolean;
  flow_config: PaymentFlowConfig | null = null;

  constructor( private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document) {}
  // constructor(private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
    // this.emailAddress = this.storage.get("useremail");
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

  // loadScript(url: string) {
  //   const script = this.renderer.createElement('script');
  //   script.src = url;
  //   this.renderer.appendChild(document.body, script);
  // }

  // loadStylesheet(url: string) {
  //   const link = this.renderer.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = url;
  //   this.renderer.appendChild(document.head, link);
  // }

  loadResources() {
    // Dynamically load ES module script
    const esmScript = this.renderer2.createElement('script');
    esmScript.type = 'module';
    esmScript.src = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk/billdesksdk.esm.js';
    this.renderer2.appendChild(this.document.body, esmScript);

    // Dynamically load non-module script
    const nomoduleScript = this.renderer2.createElement('script');
    nomoduleScript.src = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk.js';
    this.renderer2.appendChild(this.document.body, nomoduleScript);

    // Dynamically load stylesheet
    const stylesheet = this.renderer2.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://uat1.billdesk.com/merchant-uat/sdk/dist/billdesksdk/billdesksdk.css';
    this.renderer2.appendChild(this.document.head, stylesheet);
  }

  openCheckout(packageData: any) {
    this.isOrderSummary = true;
    this.isPaymentGatewayUi = false;
    this.isPaymentDetails = false;
    this.isOrderDetails = false;
    this.selectedPackage = packageData;
    // this.openModal(ModalType.SUBSCRIPTION_CHECKOUT);
    this.openModal(ModalType.PLANS_ORDER_PAYMENT);
    // this.loadResources();
  }
  cancel() {
    this.modal.cancel();
  }
  paynow() {
    // this.openModal(ModalType.PLANS_ORDER_PAYMENT);
    // this.loadResources();
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

  createOrderApi() {
    let response!: any;
    if (response) {
      // Here I'm assuming the response contains bdOrderId and authToken
      const bdOrderId = response?.bdOrderId;
      const authToken = response?.authToken;
      const returnUrl = response.returnUrl || null;

      // Here I'm creating the payment flow configuration object dynamically
      this.flow_config = {
        merchantId: "BDUATV2KTK",
        bdOrderId: bdOrderId,
        authToken: authToken,
        childWindow: true,
        returnUrl: returnUrl,
        retryCount: 3,
        // prefs: {
        //   payment_categories: ["card", "nb"],
        //   allowed_bins: ["459150", "525211"]
        // },
        // netBanking: {
        //   showPopularBanks: "Y",
        //   popularBanks: ["Kotak Bank", "AXIS Bank [Retail]"]
        // }
      };
    }
  }

  responseHandler = function (txn:any) {
    console.log("callback received status:: ", txn.status);
    console.log("callback received response:: ", txn.response);
  };

  config = {
    responseHandler: this.responseHandler,
    merchantLogo: "data:image/png;base64:eqwewqesddhgjdxsc==",
    flowConfig: this.flow_config,
    flowType: "payments",
    themeConfig: theme_config
  };

}