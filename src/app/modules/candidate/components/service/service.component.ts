import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements  OnDestroy, OnInit {
  servicesList: any = "";
  emailAddress: any = "";
  selectedStatus: string = 'AWAITING';
  selectedService: any;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage: string = "";
  successtitle: string = "";
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService, private spinner: NgxSpinnerService, private router: Router) { }
  
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.spinner.show();
    this.successtitle = 'Alert!';
    this.successmessage = "Ah, it appears you've stumbled upon a section in the works! Fear not, we're crafting a tailored experience just for you. Stay tuned as we prepare to unveil a treasure trove of job-seeking solutions. Your future success awaits!";
    setTimeout(()=> {
      this.spinner.hide();
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }, 2000);
    // this.getServices();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
    this.closeModal();
  }

  async getServices() {
    await this.candidateSrv.getServices(this.emailAddress, this.selectedStatus).then(async (response) => {
      if (response) {
        this.servicesList = response;
      }
    })
  }

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
     this.getServices();
  }

  getSelectedService(data:any){
   
    this.selectedService = data;
  }
  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }

  async referralMarkAsDone(data: any){
    let referralId = this.getSlicedValue(data.SK);
    await this.candidateSrv.markasDoneService(this.emailAddress, "DONE", referralId).then(async (response) => {
      if (response) {
        // this.referralList = response;
      }
    })
  }

  okBtn() {
    this.spinner.hide();
    this.closeModal();
    this.router.navigate(['/candidate/dashboard']);
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
