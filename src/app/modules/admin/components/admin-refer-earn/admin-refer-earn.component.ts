import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-admin-refer-earn',
  templateUrl: './admin-refer-earn.component.html',
  styleUrls: ['./admin-refer-earn.component.scss']
})
export class AdminReferEarnComponent {
  constructor(private spinner:NgxSpinnerService, private router: Router) {}
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage: string = "";
  successtitle: string = "";
  ngOnInit(): void {
   
    this.spinner.show();
    this.successtitle = 'Alert!';
    this.successmessage = "This section is currently in progress. Please check back later!";
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
