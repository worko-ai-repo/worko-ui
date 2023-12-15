import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  selectedCompany: any;
  selectedItem: any = null;
  showdiv: boolean = false;
  hidediv: boolean = true;
  isDivOpen: boolean = false;
  selectedData: any;

  companyList: any[] = [];
  companyObj: any = {
    "createdAt": "",
    "SK": "",
    "PK": "",
    "name": "",
    "updatedAt": ""
  }


  constructor(private companyListing: CompanyListingService) {

  }
  ngOnInit(): void {
    this.getCompanyDetails();


  }

  getCompanyDetails(){
    this.companyListing.getCompanyListing().subscribe({
        next: (response) => {
          console.log(response);
           this.companyList = response;
          // this.loading = false;
        },
        error: (error) => {
          debugger;
          console.error(error);
          // this.loading = false;
          // this.feedback = getErrorFeedback("ERROR.UNHANDLED_ERROR");
        },
        complete: () => {
          // Optionally handle the completion event
        }
      });
  }
  onMouseOver(item: any, event: any) {
    this.showdiv = true;
    this.companyObj = item;
    this.selectedItem = item;
    this.hidediv
  }

  onMouseOut(event: any) {
    this.showdiv = false;
  }
  isSelected(item: any) {
    return this.selectedItem === item;
  }
  

  openReferralPage(item: any) {
    this.selectedData = item;
    this.openModal(ModalType.REQUEST_REFERRAL);
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
    this.modal.cancel();
  }
}
