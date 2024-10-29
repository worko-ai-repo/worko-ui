import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  filterModel: any = {
    fromData: "",
    toDate: "",
    lifetime: '',
  }
  successTitle: string="";
  successMessage: string="";

  constructor(private spinner:NgxSpinnerService, private router: Router) {}

  ngOnInit(): void {
   
    this.spinner.show();
    this.successTitle = 'Alert!';
    this.successMessage = "This section is currently in progress. Please check back later!";
    setTimeout(()=> {
      this.spinner.hide();
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }, 2000);
    // this.getServices();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
    this.closeModal();
  }
  okBtn(){
    this.spinner.hide();
    this.closeModal();
    this.router.navigate(['/admin/aCandidate']);
  }

  applyToDateFilters() {
    throw new Error('Method not implemented.');
  }


  applyFromDateFilters() {
    throw new Error('Method not implemented.');
  }

  toggleDateFilters() {
    if (this.filterModel.lifetime) {
      this.filterModel.fromDate = null;
      this.filterModel.toDate = null;
    }
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.applyFromDateFilters();
    this.applyToDateFilters();
  }

    /**
  * Open modal.
  *
  * @param {ModalType} modalType
  * @param {string} [message = ""]
  * @param {string} [title = ""]
  * @returns {void}
  */
    openModal(modalType: ModalType, message: string = "", title: string = "", userData: any = null, userSubscription: any = null, userExperience: any = null): void {
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
