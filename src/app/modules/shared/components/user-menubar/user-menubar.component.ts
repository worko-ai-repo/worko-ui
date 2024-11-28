import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { signOut } from '@aws-amplify/auth';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

import { CognitoService } from 'src/app/modules/services/cognito.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-menubar',
  templateUrl: './user-menubar.component.html',
  styleUrls: ['./user-menubar.component.scss']
})
export class UserMenubarComponent {
  @Input() isSidebarExpanded: boolean = true;
  @Output() onToggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  @Input() userType: string = "";
  isCorporateRoute: boolean = false;
  // iconChevronLeft: IconDefinition = faChevronLeft;
  // iconChevronRight: IconDefinition = faChevronRight;
  panelOpenState = false;
  isFilesCollapsed: boolean = true;
  activeRoute: string = '';
  userLoggedIn: boolean = false;
  menuItems: any;
  adminUserType: any;
  isNotAdminDashboard!: boolean;
  isReferralSubmenuOpen: boolean = false;
  currentSubmenuStatus: string | null = null;

  private destroy$ = new Subject<void>();
  /**
   * SidebarComponent constructor.
   *
   * @param {Router} router
   */
  constructor(private router: Router, private cognitoService: CognitoService, private storage: StorageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.adminUserType = this.storage.get('userType');

    this.checkRoute();

    // Check the initial state on load
    this.updateReferralSubmenuState();

    // Listen for route changes to update the submenu state
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe((segments) => {
      this.updateReferralSubmenuState();
    });

    // Check if the use is on the corporate Page or not
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCorporateRoute = event.url.startsWith('/corporate');
      }
    });

    if(true){
      this.menuItems = [
        {
          name: 'Post Jobs',
          router: "corporate/cJobs"
        },
        {
          name: "Applicants",
          router: "corporate/cApplicants"
        },
        {
          name: 'Manage Access',
          router: "corporate/cRecruiter"
        },
        {
          name: "Settings",
          router: "corporate/cSettings"
        }
      ]}
    if (this.userType == "Candidate") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "candidate/dashboard",
        },
        {
          name: 'Referral',
          router: "candidate/referral",
          submenu: [
            { name: 'Awaiting', router: '/candidate/referral/awaiting' },
            { name: 'Accepted', router: '/candidate/referral/accepted' },
            { name: 'Rejected', router: '/candidate/referral/rejected' },
            { name: 'Cancelled', router: '/candidate/referral/cancelled' },
            { name: 'Withdrawn', router: '/candidate/referral/withdrawn' },
            { name: 'Referred', router: '/candidate/referral/referred' },
          ]
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
          router: "employee/Referral",
          submenu: [
            { name: 'Awaiting', router: '/employee/Referral/awaiting' },
            { name: 'Accepted', router: '/employee/Referral/accepted' },
            { name: 'Rejected', router: '/employee/Referral/rejected' },
            { name: 'Cancelled', router: '/employee/Referral/cancelled' },
            { name: 'Referred', router: '/employee/Referral/referred' },
          ]
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
          name: 'Jobs',
          router: "admin/ajobs"
        },
        {
          name: 'Corporate',
          router: "admin/aCorporate"
        },
        {
          name: 'Invite',
          router: "admin/aInvite"
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

  private updateReferralSubmenuState(): void {
    const currentUrl = this.router.url.toLowerCase();
    this.isReferralSubmenuOpen =
      currentUrl.startsWith('/candidate/referral/') ||
      currentUrl.startsWith('/employee/referral/');
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
    this.router.navigateByUrl('/company');

  }

  toggleSubmenu(menu: any): void {
    const isReferralMenu = (menu.name === 'Referral' || menu.name === 'Referral request');

    if (isReferralMenu && this.isNotAdminDashboard) {
      // Toggle the submenu
      this.isReferralSubmenuOpen = !this.isReferralSubmenuOpen;

      // Navigate to default route if opening and no current submenu status
      if (this.isReferralSubmenuOpen && !this.currentSubmenuStatus) {
        const defaultRoute = menu.name === 'Referral request'
          ? '/employee/Referral'
          : '/candidate/referral';

        this.router.navigate([defaultRoute]);
      }
    } else {
      // Collapse submenu and reset current status
      this.isReferralSubmenuOpen = false;
      this.currentSubmenuStatus = null;
    }
  }

  isReferralActive(): boolean {
    const currentUrl = this.router.url.toLowerCase();
    return currentUrl.startsWith('/candidate/referral') || currentUrl.startsWith('/employee/referral');
  }

  getIcon(name: string): string {
    switch (name.toLowerCase()) {
      case 'awaiting':
        return 'fas fa-clock'; // Icon for 'Awaiting'
      case 'accepted':
        return 'fas fa-check-circle'; // Icon for 'Accepted'
      case 'rejected':
        return 'fas fa-times-circle'; // Icon for 'Rejected'
      case 'cancelled':
        return 'fas fa-ban'; // Icon for 'Cancelled'
      case 'withdrawn':
        return 'fas fa-undo'; // Icon for 'Withdrawn'
      case 'referred':
        return 'fas fa-user-plus'; // Icon for 'Referred'
      default:
        return 'fas fa-circle'; // Default icon
    }
  }

  onSubmenuClick(currentSubmenu: string) {
    this.currentSubmenuStatus = currentSubmenu.toLowerCase();
  }

  ngOnDestroy(): void {
    // Notify all subscriptions to complete
    this.destroy$.next();
    this.destroy$.complete();
  }

}
