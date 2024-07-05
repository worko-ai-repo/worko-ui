import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginPageComponent) LoginPageComponent!: LoginPageComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType = ModalType.LOGIN_SIGNUP;
  userLoggedIn: boolean = false;
  emailAddress: string = "";
  profileCompletion: any = "";
  employeeTotalPercentage: any;
  candidateTotalPercentage: any;
  candidateProfile: any;
  userName: string = 'profile'
  letter: string = "";
  showLoginScreen: boolean = false;
  selectedUserType: any = 'candidate';
  userType: any;
  userTypeFromIndex: any;

  constructor(private cognitoService: CognitoService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private navbarToggleSwitchService: NavbarToggleSwitchService) {

    this.activatedRoute.queryParams.subscribe({
      next: (queryParams) => {
        this.userTypeFromIndex = queryParams['userType'];
      }
    });



  }




  // async ngAfterViewInit(): Promise<void> {


  // this.userLoggedIn = await this.cognitoService.isLoggedIn();
  // if(this.userLoggedIn && !this.userTypeFromIndex){
  //   this.navbarToggleSwitchService.intializeToggleStatus();
  //   const usertype=this.storage.get('lastAccessedDash') ;
  //    this.userName=this.storage.get('userName') ;
  //   console.log(this.userName)
  //   if(usertype==='EMP'){

  //     this.router.navigate(['/employee/Dashboard']);

  //   }else{

  //     this.router.navigate(['/candidate/dashboard']);
  //   }
  // }else if(!this.userLoggedIn && this.userTypeFromIndex){

  //   this.isUserLoggedIn=true
  //   this.selectedUserType=this.userTypeFromIndex.toLowerCase();
  //   this.modalOpen();

  // }else if(this.userLoggedIn && this.userTypeFromIndex){
  //   this.router.navigate(['/employee/Referral']);
  // }
  // else{
  //   this.isUserLoggedIn=true
  //   this.modalOpen();
  // }

  // if (this.userTypeFromIndex) {
  //   this.router.navigate([], {
  //     queryParams: {
  //       userType: null
  //     },
  //     queryParamsHandling: 'merge'
  //   });
  // }
  //}

  async ngAfterViewInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    if (this.userLoggedIn && !this.userTypeFromIndex) {
      this.handleLoggedInUser();
      return;
    }

    if (this.userLoggedIn && this.userTypeFromIndex) {
      this.router.navigate(['/employee/Referral']);
      return;
    }

    if (!this.userLoggedIn && this.userTypeFromIndex) {
      this.handleUserTypeFromIndex();
      return;
    }


    this.showLoginScreen = true;
    this.modalOpen();
  }

  private handleLoggedInUser(): void {
    this.navbarToggleSwitchService.intializeToggleStatus();
    const userType = this.storage.get('lastAccessedDash');
    this.userName = this.storage.get('userName');
    const redirectAfterLogin = this.storage.get('redirectAfterLogin');
    console.log(redirectAfterLogin)
    if (redirectAfterLogin) {
      this.storage.remove('redirectAfterLogin'); // Remove the stored URL after using it
      this.router.navigate([redirectAfterLogin]);
    }else{


    if (userType === 'EMP') {
      this.router.navigate(['/employee/Dashboard']);
    } else {
      this.router.navigate(['/candidate/dashboard']);
    }
  }
  }

  private handleUserTypeFromIndex(): void {
    this.showLoginScreen = true;
    this.selectedUserType = this.userTypeFromIndex;
   
    this.modalOpen();

    // Remove query parameters after processing
    const url = this.router.url.split('?')[0];
    this.location.replaceState(url);
  }



  modalOpen() {
    this.openModal(this.modalType.LOGIN_SIGNUP)
  }


  async receiveDataFromChild(userType: any) {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.emailAddress = this.storage.get("useremail");
    if (this.userLoggedIn) {
      if (this.router.url.includes('/companies')) {
        this.userLoggedIn = await this.cognitoService.isLoggedIn();
        this.userName = this.storage.get('userName');
     
        // this.letter=this.getInitials(this.userName)
        // console.log(this.letter);
        this.letter = this.userName.charAt(0).toUpperCase();
        // Redirect to the company listing page
        this.router.navigate(['/companies']);
        this.modal.cancel();
      }
      else {
        const response = await this.candidateSrv.getProfileComplete(this.emailAddress);
        
        if (response) {
          this.profileCompletion = response;
        

          if (this.profileCompletion) {
            const profileType = userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
            const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);
           // debugger
            if (userType === "CAND" && totalPercentage >=60) {
              this.router.navigate(['/candidate/dashboard']);
            } else if (userType === "CAND" && totalPercentage < 60) {
              this.router.navigate(['/candidate/edit-profile']);
            } else if (userType !== "CAND" && totalPercentage >=60) {
              this.router.navigate(['/employee/Dashboard']);
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

    if (this.LoginPageComponent) {
     
      this.LoginPageComponent.showAddCompanyScreen = false;
      this.LoginPageComponent.showErrorMessageScreen = false;
      this.LoginPageComponent.showLoginScreen = this.showLoginScreen
      if(this.selectedUserType==='employee'){ // opening sign up as employee if there is data in url
      this.LoginPageComponent.selectedUserType = this.selectedUserType
      this.LoginPageComponent.showSignInRow = true;
      }else{ // opening dafault login modal
        this.LoginPageComponent.selectedUserType = this.selectedUserType
        this.LoginPageComponent.showSignInRow = false;
      }

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






