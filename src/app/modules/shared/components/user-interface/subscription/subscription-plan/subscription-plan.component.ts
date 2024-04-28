import { Component, Input, ViewChild } from '@angular/core';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../modal/modal.component';

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
  isOrderSummary!:boolean;
  isPaymentDetails!:boolean
  isOrderDetails!:boolean;

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

  openCheckout(packageData: any) {
    this.isOrderSummary = true;
    this.isPaymentDetails = false;
    this.isOrderDetails = false;
    this.selectedPackage = packageData;
    // this.openModal(ModalType.SUBSCRIPTION_CHECKOUT);
    this.openModal(ModalType.PLANS_ORDER_PAYMENT);
  }
  cancel() {
    this.modal.cancel();

  }
  paynow() {
    this.openModal(ModalType.PLANS_ORDER_PAYMENT);
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