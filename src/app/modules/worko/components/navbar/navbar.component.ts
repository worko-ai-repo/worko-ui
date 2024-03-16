import { Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { Router } from '@angular/router';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  userLoggedIn: boolean = false;
  emailAddress: string = "";
  profileCompletion:any="";
  employeeTotalPercentage:any;
  candidateTotalPercentage:any;
  candidateProfile: any;
  constructor(private cognitoService: CognitoService, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService) { }


  async ngOnInit(): Promise<void> {
    this.emailAddress = this.storage.get("useremail");
    this.userLoggedIn = await this.cognitoService.isLoggedIn();


  }
  
  showSubMenu: boolean = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }

  isCollapsed: boolean = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  async logout(): Promise<void> {
    await this.cognitoService.handleSignOut();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }

  async receiveDataFromChild(userType: any){
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if(this.userLoggedIn){
      if (this.router.url.includes('/company-listing')) {
        // Redirect to the company listing page
        this.router.navigate(['/company-listing']);
        this.modal.cancel();
      } 
     else{
      const response = await this.candidateSrv.getProfileComplete(this.emailAddress);

      if (response) {
        this.profileCompletion = response;
        console.log(this.profileCompletion);


        if (this.profileCompletion) {
          const profileType = userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
          const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);

          if (userType === "CAND" && totalPercentage > 60) {
            this.router.navigate(['/candidate/dashboard']);
          } else if (userType === "CAND" && totalPercentage < 60) {
            this.router.navigate(['/candidate/cedit-profile']);
          } else if (userType !== "CAND" && totalPercentage > 60) {
            this.router.navigate(['/employee/edashboard']);
          } else if (userType !== "CAND" && totalPercentage < 60) {
            this.router.navigate(['/employee/eEdit-profile']);
          }
        }
      }
    }
  }
 
  }

  async openLogin() {
    if (this.userLoggedIn) {
      alert("User is Logged In")
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
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
