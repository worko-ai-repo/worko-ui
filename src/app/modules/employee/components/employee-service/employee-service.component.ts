import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-service',
  templateUrl: './employee-service.component.html',
  styleUrls: ['./employee-service.component.scss']
})
export class EmployeeServiceComponent implements  OnDestroy, OnInit {

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
    this.successmessage = "Well, well, well, it seems you've discovered a section that's currently under construction! But fret not, we're concocting something truly special for you. Keep your eyes peeled as we prepare to reveal how your skills can turn into golden opportunities. The countdown to your earning potential begins now!";
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

  selectedStatus: string = 'AWAITING';

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
  }

}
