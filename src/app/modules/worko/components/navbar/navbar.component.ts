import { Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NavigationEnd, Router } from '@angular/router';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { IndexComponent } from '../index/index.component';
import { environment } from 'src/environments/environment';
// import { LoginPageComponent } from '../login-page/login-page.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  isCompanyPage: boolean = false;
  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  event$: Observable<any> = this.eventSubject.asObservable();
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginFormComponent) LoginFormComponent!: LoginFormComponent;
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
  letter: string = ""
  showOptions = false;



  constructor(private cognitoService: CognitoService, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private navbarToggleSwitchService: NavbarToggleSwitchService) {

  }


  async ngOnInit(): Promise<void> {
    // this.emailAddress = this.storage.get("useremail");
    // this.storage.get("useremail").subscribe((email: string) => {
    //   this.emailAddress = email; // Update userEmail whenever the value changes
    //   console.log(this.emailAddress, email, "dsd")
    // });
    this.initializeUserSession();
    this.checkCurrentRoute();
    // Subscribe to route changes to update the UI dynamically when navigating
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute();
      }
    });
  }

  isMenuOpen: boolean = false;

  toggleMenu(event: any) {
    this.isMenuOpen = event.target.checked;
  }
  dashboard() {
    this.navbarToggleSwitchService.intializeToggleStatus();
    const usertype = this.storage.get('lastAccessedDash');
    this.userName = this.storage.get('userName');

    if (usertype === 'EMP') {

      this.router.navigate(['/employee/Dashboard']);

    } else {

      this.router.navigate(['/candidate/dashboard']);
    }

  }
  navigateToIndex() {
    window.location.href = environment.localUrl + '/';
  }

  checkCurrentRoute() {
    // Check if the current URL is '/companies'
    this.isCompanyPage = this.router.url === '/companies';
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

  async initializeUserSession() {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      this.userName = this.storage.get('userName');

      // this.letter=this.getInitials(this.userName)
      // console.log(this.letter);
      this.letter = this.userName.charAt(0).toUpperCase();
    }
  }

  async receiveDataFromChild(userType: any) {
    // Get the current URL
    const currentUrl = this.router.url;

    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.emailAddress = this.storage.get("useremail");

    if (this.userLoggedIn) {
      if (currentUrl.includes('/companies') || currentUrl.match(/-jobs$/)) {
        this.userName = this.storage.get('userName');

        // this.letter=this.getInitials(this.userName)
        // console.log(this.letter);
        if (this.userName) {
          this.letter = this.userName.charAt(0).toUpperCase();
        }
  
        // Define the regular expression to match the URL pattern
        const dynamicUrlPattern = /^\/companies\/[a-zA-Z0-9-]+-jobs\/[a-zA-Z0-9-]+\/[a-zA-Z0-9]+$/;

        // Check if the current URL matches the pattern
        if (dynamicUrlPattern.test(currentUrl)) {

          this.router.navigate([this.router.url]);

        } else if (this.router.url.includes('-jobs')) {

            // If the URL contains "-jobs", route to the current dynamic route
            this.router.navigate([this.router.url]);

          } else if (currentUrl.includes('/companies')) {
            // Redirect to the company listing page

            this.router.navigate(['/companies']);

          } else if (currentUrl.match(/-jobs$/)) {

            // Refresh the current route ending with -jobs
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          }
          this.eventSubject.next(userType); // Emit the userType each time a login is successful through the navbar component
          // This event will be captured by the parent component (companyListing) to perform required actions 

          this.modal.cancel();
        }
        else {
          const response = await this.candidateSrv.getProfileComplete(this.emailAddress);

          if (response) {
            this.profileCompletion = response;


            if (this.profileCompletion) {
              const profileType = userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
              const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);

              if (userType === "CAND" && totalPercentage >= 60) {
                this.router.navigate(['/candidate/dashboard']);
              } else if (userType === "CAND" && totalPercentage < 60) {
                this.router.navigate(['/candidate/edit-profile']);
              } else if (userType !== "CAND" && totalPercentage >= 60) {
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

  async openLogin() {
      if (this.userLoggedIn) {
        alert("User is Logged In")

      } else {
        this.openModal(ModalType.LOGIN_SIGNUP);
        //this.router.navigate(['/login']);
      }
    }


    rediectToFaq() {
      window.location.href = environment.localUrl + '/faq'
    }
    rediectToAboutUs() {
      window.location.href = environment.localUrl + '/about-us'
    }
    rediectToCorporate() {
      window.location.href = environment.localUrl + '/corporate'
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
      // debugger
      if(this.LoginFormComponent) {
      this.LoginFormComponent.showSignInRow = false;
      this.LoginFormComponent.showAddCompanyScreen = false;
      this.LoginFormComponent.showErrorMessageScreen = false;
      this.LoginFormComponent.showLoginScreen = true
    }

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
