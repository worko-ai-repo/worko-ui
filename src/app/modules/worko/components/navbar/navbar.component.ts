import { Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { Router } from '@angular/router';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';

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
  profileCompletion: any = "";
  employeeTotalPercentage: any;
  candidateTotalPercentage: any;
  candidateProfile: any;
 userName:string='profile'
  letter:string=""
  showOptions = false; 
  constructor(private cognitoService: CognitoService, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private navbarToggleSwitchService : NavbarToggleSwitchService) {
   
   }


  async ngOnInit(): Promise<void> {
    // this.emailAddress = this.storage.get("useremail");
    // this.storage.get("useremail").subscribe((email: string) => {
    //   this.emailAddress = email; // Update userEmail whenever the value changes
    //   console.log(this.emailAddress, email, "dsd")
    // });
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.userName=this.storage.get('userName') ;
    console.log(this.userName)
    // this.letter=this.getInitials(this.userName)
    // console.log(this.letter);
    this.letter  = this.userName.charAt(0).toUpperCase();

  }

  isMenuOpen: boolean = false;

  toggleMenu(event: any) {
    this.isMenuOpen = event.target.checked;
  }
  dashboard(){
    this.navbarToggleSwitchService.intializeToggleStatus();
    const usertype=this.storage.get('lastAccessedDash') ;
     this.userName=this.storage.get('userName') ;
    console.log(this.userName)
    if(usertype==='EMP'){
      
      this.router.navigate(['/employee/Dashboard']);

    }else{
      
      this.router.navigate(['/candidate/dashboard']);
    }

  }
  //  getInitials(name: string): string {
   
  //   const fullName = name.split('.')[0];
    
  
  //   const parts = fullName.split(" ");
   

   
  //  return  this.letter = parts.map((part: string) => part.charAt(0)).join("").toUpperCase();
  // }



  // showSubMenu: boolean = false;

  // toggleSubMenu() {
  //   this.showSubMenu = !this.showSubMenu;
  // }

  // showSubMenuOnHover() {
  //   if (window.innerWidth >= 675) {
  //     this.showSubMenu = true;
  //   }
  // }

  // hideSubMenuOnHover() {
  //   if (window.innerWidth >= 675) {
  //     this.showSubMenu = false;
  //   }
  // }

  isCollapsed: boolean = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  async logout(): Promise<void> {
    await this.cognitoService.handleSignOut();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  
    // Optionally, close the dropdown after logout
   

  }

  async receiveDataFromChild(userType: any) {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.emailAddress = this.storage.get("useremail");
    if (this.userLoggedIn) {
      if (this.router.url.includes('/company-listing')) {
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
