import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginPageComponent) LoginPageComponent!:LoginPageComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType =ModalType.LOGIN_SIGNUP;
  userLoggedIn: boolean = false;
  emailAddress: string = "";
  profileCompletion: any = "";
  employeeTotalPercentage: any;
  candidateTotalPercentage: any;
  candidateProfile: any;
 userName:string='profile'
  letter:string="";
  isUserLoggedIn:boolean=false;
  selectedUserType: any='candidate';
  userType: any;
  userTypeFromIndex: any;

  constructor(private cognitoService: CognitoService,private activatedRoute: ActivatedRoute, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private navbarToggleSwitchService : NavbarToggleSwitchService) {
   
    this.activatedRoute.queryParams.subscribe({
      next: (queryParams) => {
        this.userTypeFromIndex = queryParams['userType'];
      }});
  }
 

 
  
  async ngAfterViewInit(): Promise<void> {
   
   
  this.userLoggedIn = await this.cognitoService.isLoggedIn();
  if(this.userLoggedIn && !this.userTypeFromIndex){
    this.navbarToggleSwitchService.intializeToggleStatus();
    const usertype=this.storage.get('lastAccessedDash') ;
     this.userName=this.storage.get('userName') ;
    console.log(this.userName)
    if(usertype==='EMP'){
      
      this.router.navigate(['/employee/Dashboard']);

    }else{
      
      this.router.navigate(['/candidate/dashboard']);
    }
  }else if(!this.userLoggedIn && this.userTypeFromIndex){
    
    this.isUserLoggedIn=true
    this.selectedUserType='employee'
  this.modalOpen();
  }else if(this.userLoggedIn && this.userTypeFromIndex){
    this.router.navigate(['/employee/Referral']);
  }
  else{
    this.isUserLoggedIn=true
    this.modalOpen();
  }
}
  modalOpen(){
    this.openModal(this.modalType.LOGIN_SIGNUP)
  }
 

  async receiveDataFromChild(userType: any) {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.emailAddress = this.storage.get("useremail");
    if (this.userLoggedIn) {
      if (this.router.url.includes('/company-listing')) {
        this.userLoggedIn = await this.cognitoService.isLoggedIn();
        this.userName=this.storage.get('userName') ;
        console.log(this.userName)
        // this.letter=this.getInitials(this.userName)
        // console.log(this.letter);
        this.letter  = this.userName.charAt(0).toUpperCase();
        // Redirect to the company listing page
        this.router.navigate(['/company-listing']);
        this.modal.cancel();
      }
      else {
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
              this.router.navigate(['/candidate/edit-profile']);
            } else if (userType !== "CAND" && totalPercentage > 60) {
              this.router.navigate(['/employee/dashboard']);
            } else if (userType !== "CAND" && totalPercentage < 60) {
              this.router.navigate(['/employee/Edit-profile']);
            }
          }
          this.modal.cancel();
        }
      }
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
    
    if(this.LoginPageComponent){
      this.LoginPageComponent.showSignInRow=true;
      this.LoginPageComponent.showAddCompanyScreen=false;
      this.LoginPageComponent.showErrorMessageScreen=false;
      this.LoginPageComponent.isUserLoggedIn=this.isUserLoggedIn
      this.LoginPageComponent.selectedUserType=this.selectedUserType

    }
   
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open()
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






