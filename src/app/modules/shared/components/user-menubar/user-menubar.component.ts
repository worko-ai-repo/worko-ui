import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { signOut } from '@aws-amplify/auth';
import { filter } from 'rxjs';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

import { CognitoService } from 'src/app/modules/services/cognito.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-menubar',
  templateUrl: './user-menubar.component.html',
  styleUrls: ['./user-menubar.component.scss']
})
export class UserMenubarComponent {
  @Input() isSidebarExpanded: boolean = true;
  @Output() onToggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  @Input() userType: string = "";

  // iconChevronLeft: IconDefinition = faChevronLeft;
  // iconChevronRight: IconDefinition = faChevronRight;
  panelOpenState = false;
  isFilesCollapsed: boolean = true;
  activeRoute: string = '';
  userLoggedIn: boolean = false;
  menuItems: any;
  adminUserType: any;
  isNotAdminDashboard!: boolean;
  /**
   * SidebarComponent constructor.
   *
   * @param {Router} router
   */
  constructor(private router: Router, private cognitoService: CognitoService, private storage: StorageService) { }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.adminUserType = this.storage.get('userType');

    this.checkRoute();


    if (this.userType == "Candidate") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "candidate/dashboard",
        },
        {
          name: 'Referral',
          router: "candidate/referral",
        },
        {
          name: 'Service',
          router: "candidate/service",
        },
        {
          name: 'Subscription',
          router: "candidate/subscription"
        },
        {
          name: 'Refer & Earn',
          router: "candidate/refer&earn"
        },
        // {
        //   name: 'Settings',
        //   router: "candidate/crefer&earn"
        // },
      ]
    }



    if (this.userType == "Employee") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "employee/Dashboard"
        },
        {
          name: 'Referral request',
          router: "employee/Referral"
        },
        {
          name: 'Service request',
          router: "employee/Service"
        },
        {
          name: 'Packages',
          router: "employee/Packages"
        },
        {
          name: 'Refer & Earn',
          router: "employee/Refer&earn"
        },
        // {
        //   name: 'Settings',
        //   router: "employee/erefer&earn"
        // },
      ]
    }
    if (this.userType == "Admin") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "admin/aDashboard"
        },
        {
          name: 'Candidate',
          router: "admin/aCandidate"
        },
        {
          name: 'Employee',
          router: "admin/aEmployee"
        },
        {
          name: 'Referral',
          router: "admin/aReferral"
        },
        {
          name: 'Service',
          router: "admin/aService"
        },
        {
          name: 'Issues',
          router: "admin/aIssues"
        },
        {
          name: 'Payment',
          router: "admin/aPayment"
        },

        {
          name: 'Refer & Earn',
          router: "admin/aRefer-Earn"
        },
        {
          name: 'Settings',
          router: "admin/aSetting"
        },
      ]
    }
  }


  isMenuOpen: boolean = false;

  toggleMenu(event: any) {
    // this.isMenuOpen = event.target.checked;
    this.isMenuOpen = !this.isMenuOpen;

  }
  checkRoute(): void {

    this.isNotAdminDashboard = !this.router.url.includes('admin');
  }

  /**
   * Toggle sidebar.
   *
   * @returns {void}
   */
  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }

  async logout(): Promise<void> {
    await this.cognitoService.handleSignOut();
    await signOut();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (!this.userLoggedIn) {
      this.router.navigateByUrl('/');
      // window.location.href = environment.crossOriginUrl + '/';
    }
  }

  //route user to company lisiting if user is clicks on worko logo
  userCheck() {
    const currentUrl = window.location.href;

    //   // Check if the URL contains "employee" or "candidate"
    //   console.log(currentUrl)
    //   if (currentUrl.includes("employee")) {
    //     console.log('emp')

    //     this.router.navigateByUrl('/employee/Dashboard');
    //   } else {
    //     console.log('can')
    //     this.router.navigateByUrl('/candidate/dashboard');
    //   }
    this.router.navigateByUrl('/companies');

  }

}
