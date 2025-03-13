import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarToggleSwitchService } from '../../services/navbar-toggle-switch.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent implements OnInit {
  @Input() userType: string = "";
  userRole: any;
  activeRoute: string = '';
  emailAddress: any;
  navbarToggleSwitchService: NavbarToggleSwitchService;
  constructor(private router: Router, navbarToggleSwitchService: NavbarToggleSwitchService, private authService: AuthService, private storage: StorageService,private cognitoService: CognitoService) {

    this.navbarToggleSwitchService = navbarToggleSwitchService;
  }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("userEmail");
    //debugger

    if (this.router.url.includes('candidate')) {
      if (this.navbarToggleSwitchService.getCurrentDashboard() !== false) {
        this.navbarToggleSwitchService.setDashboard("CAND");
        this.updateLastAccessDashboard();
      }
    } // Ensure the navbar toggle updates correctly based on the URL when navigating back or forward in the browser. 
    // Also, update the last accessed dashboard accordingly.

    else if (this.router.url.includes('employee')) {
      if (this.navbarToggleSwitchService.getCurrentDashboard() !== true) {
        this.navbarToggleSwitchService.setDashboard("EMP");
        this.updateLastAccessDashboard();
      }
    }

    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.userRole = [
        {
          name: 'Candidate Dashboard',
          togglName: 'Switch To Employee Dashboard'

        },

      ]
    }

    if (this.userType == "Employee") {
      this.userRole = [
        {
          name: 'Employee Dashboard',
          togglName: 'Switch To Candidate Dashboard'
        },

      ]
    }
    if (this.userType == "Admin") {
      this.userRole = [
        {
          name: 'Admin Dashboard',

        },

      ]
    }

    this.getToggleStatus();
  }

  getToggleStatus() {
    // return this.navbarToggleSwitchService.getIsEmployeeDashboard();
    // console.log("current toggle status", this.navbarToggleSwitchService.getCurrentDashboard());
    return this.navbarToggleSwitchService.getCurrentDashboard();
  }

  async toggleDashboard() {

    this.navbarToggleSwitchService.toggleDashboard();

    if (this.navbarToggleSwitchService.getCurrentDashboard()) {
      this.router.navigate(['/employee/Dashboard']);
      //debugger
    } else {
      this.router.navigate(['/candidate/dashboard']);
    }

    this.updateLastAccessDashboard();
    
  }

  async updateLastAccessDashboard() {   
    //API Call to update the hboard

    let payload = {
      lastAccessedDash: this.navbarToggleSwitchService.getDashboard()
    }
    await this.authService.updateProfile(this.emailAddress, payload).then(async (response) => {
    })
      .catch(error => {
        this.cognitoService.handleSignOut();
        console.error('Error is', error);
        
    });
  }

}
