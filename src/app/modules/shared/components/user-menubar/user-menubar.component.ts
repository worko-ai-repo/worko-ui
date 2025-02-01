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
  isScreenerSubmenuOpen: boolean = false;
  isCompanySubmenuOpen: boolean = false;
  currentSubmenuStatus: string | null = null;

  isJobsSubmenuOpen: boolean = false;

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
    this.updateSubmenuStates();;

    // Listen for route changes to update the submenu state
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe((segments) => {
      this.updateSubmenuStates();
    });

    // Check if the use is on the corporate Page or not
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCorporateRoute = event.url.startsWith('/corporate');
      }
    });

    if (true) {
      this.menuItems = [
        {
          name: 'Jobs',
          router: "corporate/cJobs"
        },
        {
          name: "Application",
          router: "corporate/cApplicants/"
        },
        // {
        //   name: "Candidate Screener",
        //   router: "corporate/cCandidateScreener",
        //   submenu: [
        //     { name: 'New Screening', router: 'corporate/cCandidateScreener/cCandidateScreener' },
        //     { name: 'Screened List', router: 'corporate/cCandidateScreener/cScreeningList' }
        //   ]
        // },
        {
          name: "Candidate Screener",
          router: "corporate/cCandidateScreener",
          submenu: [
            { name: 'New Screening', router: 'corporate/cCandidateScreener/cNewScreening' },
            { name: 'Screened List', router: 'corporate/cCandidateScreener/cScreeningList' },
          ]
        },

        // {
        //   name: 'Referral request',
        //   router: "employee/Referral",
        //   submenu: [
        //     { name: 'Awaiting', router: '/employee/Referral/awaiting' },
        //     { name: 'Accepted', router: '/employee/Referral/accepted' },
        //     { name: 'Rejected', router: '/employee/Referral/rejected' },
        //     { name: 'Cancelled', router: '/employee/Referral/cancelled' },
        //     { name: 'Referred', router: '/employee/Referral/referred' },
        //   ]
        // }
        {
          name: 'Invites',
          router: "corporate/cInvites"
        },
        {
          name: 'Manage Users',
          router: "corporate/cManageUsers"
        },
        {
          name: "Settings",
          router: "corporate/cSettings"
        }
      ]
    }
    if (this.userType == "Candidate") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "candidate/dashboard",
        },
        {
          name: 'Job',
          router: "candidate/jobs",
          submenu: [
            { name: 'Applied', router: '/candidate/jobs/applied' },
            { name: 'CV Downloaded', router: '/candidate/jobs/cv-downloaded' },
            { name: 'Under Evaluation', router: '/candidate/jobs/under-evaluation' },
            { name: 'Processing Interview', router: '/candidate/jobs/processing-interview' },
            { name: 'Interview Done', router: '/candidate/jobs/interview-done' },
            { name: 'Hired', router: '/candidate/jobs/hired' },
            { name: 'Rejected', router: '/candidate/jobs/rejected' },
          ]
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
          name: 'Referrals',
          router: "admin/aReferral"
        },
        {
          name: 'Company',
          router: "aCompany",
          submenu: [
            {
              name: 'Listing', router: "aCompany/listing"
            },
            {
              name: 'Requests', router: "aCompany/requests"
            }
          ]
        },
        {
          name: 'Screened List',
          router: "admin/aCandidateScreener/aScreeningList"
        },
        {
          name: 'Jobs',
          router: "admin/ajobs"
        },
        {
          name: "Application",
          router: "admin/aApplicants/"
        },
        {
          name: 'Corporate Users',
          router: "admin/aCorporate/Users"
        },
        {
          name: 'Invites',
          router: "admin/aCorporate/Invite"
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

  // private updateReferralSubmenuState(): void {
  //   const currentUrl = this.router.url.toLowerCase();
  //   this.isReferralSubmenuOpen =
  //     currentUrl.startsWith('/candidate/referral/') ||
  //     currentUrl.startsWith('/employee/referral/');
  // }

  private updateSubmenuStates(): void {
    const currentUrl = this.router.url.toLowerCase();

    this.isReferralSubmenuOpen = currentUrl.startsWith('/candidate/referral/') || currentUrl.startsWith('/employee/referral/');
    this.isJobsSubmenuOpen = currentUrl.startsWith('/candidate/jobs/');
    this.isScreenerSubmenuOpen = currentUrl.startsWith('/corporate/ccandidatescreener');
    this.isCompanySubmenuOpen = currentUrl.startsWith('/admin/acompany');
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

  // toggleSubmenu(menu: any): void {
  //   const isReferralMenu = (menu.name === 'Referral' || menu.name === 'Referral request');
  //   const isJobsMenu = (menu.name === 'Jobs');

  //   if (isReferralMenu && this.isNotAdminDashboard) {
  //     // Toggle the submenu
  //     this.isReferralSubmenuOpen = !this.isReferralSubmenuOpen;

  //     if(this.isReferralSubmenuOpen) {
  //       this.isJobsSubmenuOpen = false;
  //     }

  //     // Navigate to default route if opening and no current submenu status
  //     if (this.isReferralSubmenuOpen && !this.currentSubmenuStatus) {
  //       const defaultRoute = menu.name === 'Referral request'
  //         ? '/employee/Referral'
  //         : '/candidate/referral';

  //       this.router.navigate([defaultRoute]);
  //     }
  //   } 
  //   else if(isJobsMenu && this.isNotAdminDashboard) {
  //     // Toggle the submenu
  //     this.isJobsSubmenuOpen = !this.isJobsSubmenuOpen;

  //     if(this.isJobsSubmenuOpen) {
  //       this.isReferralSubmenuOpen = false;
  //     }

  //     // Navigate to default route if opening and no current submenu status
  //     if(this.isJobsSubmenuOpen && !this.currentSubmenuStatus) {
  //       if(menu.name === 'Jobs'){
  //         const defaultRoute = '/candidate/jobs';
  //         this.router.navigate([defaultRoute]);
  //       }
  //     }
  //   }
  //   else {
  //     // Collapse submenu and reset current status
  //     this.isJobsSubmenuOpen = false;
  //     this.isReferralSubmenuOpen = false;
  //     this.currentSubmenuStatus = null;
  //   }
  // }

  toggleSubmenu(menu: any): void {
    const isReferralMenu = (menu.name === 'Referral' || menu.name === 'Referral request');
    const isJobsMenu = menu.name === 'Job';
    const isScreeningMenu = (menu.name === 'Candidate Screener');
    const isCompanyMenu = (menu.name === 'Company');

    if (isReferralMenu && this.isNotAdminDashboard) {
      this.isReferralSubmenuOpen = !this.isReferralSubmenuOpen;
      this.isJobsSubmenuOpen = false;

      // if (this.isReferralSubmenuOpen && !this.currentSubmenuStatus) { Previous working code

      if (this.isReferralSubmenuOpen) {
        const defaultRoute = menu.name === 'Referral request' ? '/employee/Referral' : '/candidate/referral';
        this.router.navigate([defaultRoute]);
        // this.router.navigate(['/candidate/referral']);
      }
    } else if (isJobsMenu && this.isNotAdminDashboard) {
      this.isJobsSubmenuOpen = !this.isJobsSubmenuOpen;
      this.isReferralSubmenuOpen = false;

      // if (this.isJobsSubmenuOpen && !this.currentSubmenuStatus) { Previous working code

      if (this.isJobsSubmenuOpen) {
        this.router.navigate(['/candidate/jobs']);
      }
    }
    else if (isScreeningMenu && this.isNotAdminDashboard) {
      this.isScreenerSubmenuOpen = !this.isScreenerSubmenuOpen;
      this.router.navigate(['/corporate/cCandidateScreener']);
    } 
    else if(isCompanyMenu) {
      this.isCompanySubmenuOpen = !this.isCompanySubmenuOpen;

      if (this.isCompanySubmenuOpen) {
        this.router.navigate(['/admin/aCompany']);
      }
    }
    else {
      this.isReferralSubmenuOpen = false;
      this.isJobsSubmenuOpen = false;
      this.isScreenerSubmenuOpen = false;
      this.currentSubmenuStatus = null;
      this.isCompanySubmenuOpen = false;
    }
  }

  isCandidateScreenerActive(): boolean {
    const currentUrl = this.router.url.toLowerCase();
    // console.log(currentUrl.startsWith('/corporate/cCandidateScreener'));
    return currentUrl.startsWith('/corporate/cCandidateScreener');
  }

  // isReferralActive(): boolean {
  //   const currentUrl = this.router.url.toLowerCase();
  //   return currentUrl.startsWith('/candidate/referral') || currentUrl.startsWith('/employee/referral');
  // }

  isReferralActive(): boolean {
    const currentUrl = this.router.url.toLowerCase();
    return currentUrl.startsWith('/candidate/referral') || currentUrl.startsWith('/employee/referral');
  }

  isJobsActive(): boolean {
    const currentUrl = this.router.url.toLowerCase();
    return currentUrl.startsWith('/candidate/jobs');
  }

  isCompanyActive(): boolean {
    const currentUrl = this.router.url.toLowerCase();
    return currentUrl.startsWith('/admin/acompany');
  }

  // getIcon(name: string): string {
  //   switch (name.toLowerCase()) {
  //     case 'awaiting':
  //       return 'fas fa-clock'; // Icon for 'Awaiting'
  //     case 'accepted':
  //       return 'fas fa-check-circle'; // Icon for 'Accepted'
  //     case 'rejected':
  //       return 'fas fa-times-circle'; // Icon for 'Rejected'
  //     case 'cancelled':
  //       return 'fas fa-ban'; // Icon for 'Cancelled'
  //     case 'withdrawn':
  //       return 'fas fa-undo'; // Icon for 'Withdrawn'
  //     case 'referred':
  //       return 'fas fa-user-plus'; // Icon for 'Referred'
  //     default:
  //       return 'fas fa-circle'; // Default icon
  //   }
  // }

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
      case 'applied':
        return 'fas fa-file-alt'; // Icon for 'Applied'
      case 'cv downloaded':
        return 'fas fa-download'; // Icon for 'CV Downloaded'
      case 'under evaluation':
        return 'fas fa-search'; // Icon for 'Under Evaluation'
      case 'processing interview':
        return 'fas fa-user-clock'; // Icon for 'Processing Interview'
      case 'interview done':
        return 'fas fa-user-check'; // Icon for 'Interview Done'
      case 'hired':
        return 'fas fa-user-tie'; // Icon for 'Hired'
      case 'new screening':
        return 'fas fa-filter'; // Icon for Screening Resumes
      case 'screened list':
        return 'fas fa-list-alt'; // Icon for Screened List  
      case 'listing':
        return 'fas fa-building'; // Icon for Company Listing
      case 'requests':
        return 'fas fa-clipboard-list'; // Icon for Request Listing
      default:
        return 'fas fa-circle'; // Default icon
    }
  }


  // onSubmenuClick(submenuName: string): void {
  //   this.currentSubmenuStatus = submenuName.toLowerCase();
  //   const submenuRoutes: { [key: string]: string } = {
  //     'New Screening': 'corporate/cCandidateScreener/cNewScreening',
  //     'Screened List': 'corporate/cCandidateScreener/cScreeningList',
  //   };

  //   if (submenuRoutes[submenuName]) {
  //     this.router.navigate([submenuRoutes[submenuName]]);
  //   }
  // }

  onSubmenuClick(currentSubmenu: string) {
    if (currentSubmenu === "Screened List") {
      this.router.navigate(['/corporate/cCandidateScreener/cScreeningList']);
    } else if (currentSubmenu === "New Screening") {
      this.router.navigate(['/corporate/cCandidateScreener/cNewScreening']);
    }
  }



  ngOnDestroy(): void {
    // Notify all subscriptions to complete
    this.destroy$.next();
    this.destroy$.complete();
  }

}
