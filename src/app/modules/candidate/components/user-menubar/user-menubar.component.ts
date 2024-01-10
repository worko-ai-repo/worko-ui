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
        {
          name: 'Settings',
          router: "candidate/refer&earn"
        },
      ]
    }

    if (this.userType == "Employee") {
      this.menuItems = [
        {
          name: 'Dashboard',
          router: "employee/dashboard"
        },
        {
          name: 'Referral',
          router: "employee/referral"
        },
        {
          name: 'Service',
          router: "employee/service"
        },
        {
          name: 'Packages',
          router: "employee/packages"
        },
        {
          name: 'Refer & Earn',
          router: "employee/refer&earn"
        },
        {
          name: 'Settings',
          router: "employee/refer&earn"
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
