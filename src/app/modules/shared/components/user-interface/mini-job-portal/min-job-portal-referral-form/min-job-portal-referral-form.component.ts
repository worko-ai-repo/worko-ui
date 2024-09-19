import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../modal/modal.component';
import { Router } from '@angular/router';
import { LoginPageComponent } from 'src/app/modules/worko/components/login-page/login-page.component';

@Component({
  selector: 'app-min-job-portal-referral-form',
  templateUrl: './min-job-portal-referral-form.component.html',
  styleUrls: ['./min-job-portal-referral-form.component.scss']
})
export class MinJobPortalReferralFormComponent {

  @Input()  companyName:any
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginPageComponent) LoginPageComponent!: LoginPageComponent;
  userLoggedIn: boolean = false;
  profileCompletion: any;
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;


  constructor(private cognitoService:CognitoService,private storage:StorageService,private router:Router,private cdr: ChangeDetectorRef,){}

  async openReferralPage(event: Event): Promise<void> {
    event.preventDefault();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    // this.storage.set('selectedCompanySK', this?.selectedData?.SK);
    // this.storage.set('type', "referral");

    // this.triggerReferral = true;
    // this.triggerGuidance = false;
    // this.triggerAddCompany = false;

    if (this.userLoggedIn) {
      if (this.checkProfileCompletion()) {
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
      else {
        this.profileCompletionRequired = true;
        this.successmessage = "";
        this.successtitle = "";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
      this.storage.remove("type");    // Removing 'type' and 'selectedCompanySK' from localStorage to prevent the popup from opening automatically on the next page refresh
      this.storage.remove("selectedCompanySK");
    }
    else {
      this.userLoggedIn = true
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  checkProfileCompletion(): any {
    if (this.totalPercentage > 60 && this.cvCurPerc !== 0) {
      return true;
    }
    else {
      return false;
    }
  }

  cancel() {
    this.modal.cancel();
  }

  completeProfile() {
    this.closeModal();
    // this.profileCompletionRequired = false;
    this.router.navigate(['/candidate/edit-profile']);
  }

  onModalClose() {
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
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
      this.cdr.detectChanges(); // This resolves an issue where the ViewChild reference was sometimes undefined
      this.modalMessage = message;
      this.modalTitle = title;
  
      if (ModalType.LOGIN_SIGNUP) {
        if (this.LoginPageComponent) {
          this.LoginPageComponent.showSignInRow = false;
          this.LoginPageComponent.showAddCompanyScreen = false;
          this.LoginPageComponent.showErrorMessageScreen = false;
          this.LoginPageComponent.showLoginScreen = true
        }
      }
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
