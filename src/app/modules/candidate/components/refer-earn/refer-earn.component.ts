import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refer-earn',
  templateUrl: './refer-earn.component.html',
  styleUrls: ['./refer-earn.component.scss']
})
export class ReferEarnComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage: string = "";
  successtitle: string = "";

  constructor(private spinner: NgxSpinnerService, private router: Router) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.successtitle = 'Alert!';
    this.successmessage = "Hey there, savvy networker! Our 'Refer & Earn' section is brewing up some serious cash opportunities just for you. unleash the power of your network to earn real money effortlessly. Your referral game is about to level up!";
    setTimeout(()=> {
      this.spinner.hide();
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }, 2000);
  }
  ngOnDestroy(): void {
    this.spinner.hide();
    this.closeModal();
  }

  okBtn() {
    this.spinner.hide();
    this.closeModal();
    this.router.navigate(['/employee/Dashboard']);
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
