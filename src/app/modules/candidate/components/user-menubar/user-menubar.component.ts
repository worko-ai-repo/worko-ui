import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';

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
  /**
   * SidebarComponent constructor.
   *
   * @param {Router} router
   */
  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "candidate/dashboard", 
        },
        {
          name: 'Referral',
          router: "candidate/creferral",
        },
        {
          name: 'Service',
          router: "candidate/cservice",
        },
        {
          name: 'Subscription',
          router: "candidate/csubscription"
        },
        {
          name: 'Refer & Earn',
          router: "candidate/crefer&earn"
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
          router: "employee/edashboard"
        },
        {
          name: 'Referral request',
          router: "employee/ereferral"
        },
        {
          name: 'Service request',
          router: "employee/eservice"
        },
        {
          name: 'Packages',
          router: "employee/epackages"
        },
        {
          name: 'Refer & Earn',
          router: "employee/erefer&earn"
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
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (!this.userLoggedIn) {
      this.router.navigateByUrl('/');
    }
  }
}
