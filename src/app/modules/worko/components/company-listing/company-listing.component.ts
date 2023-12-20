import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
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
  pageSize = 50;
  lastKey: string | undefined = undefined;
  loadedOnce: boolean = true;
  companyList: any[] = [];

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Handle scroll event
    this.detectScroll();
  }

  constructor(private companyListing: CompanyListingService) {

  }
  ngOnInit(): void {
    this.getCompanyDetails();


  }

  detectScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  
    // Check if the user has scrolled to the bottom
  
    if (scrollPosition + windowHeight >= documentHeight) {
      // Load more data
      this.getCompanyDetails();
    }
  }

  async getCompanyDetails(){
    if(this.lastKey || this.loadedOnce){ 
     await this.companyListing.getCompanyListing(this.pageSize,  this.lastKey).then(async (response) => {
      if (response) {
        console.log("Helo11");
        this.companyList = this.companyList.concat(response.data); 
        this.lastKey = response.pagination.lastKey;
        this.loadedOnce = false;
      }
    })
      .catch(error => {
        console.error('Display Company Listing Error:', error);
      });
    }
  }
  // onMouseOver(item: any, event: any) {
  //   this.showdiv = true;
  //   this.selectedItem = item;
  // }

  // onMouseOut(event: any) {
  //   this.showdiv = false;
  // }
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
