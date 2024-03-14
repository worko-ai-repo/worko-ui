import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarToggleSwitchService } from '../../services/navbar-toggle-switch.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent implements OnInit{
  @Input() userType: string = "";
  userRole: any;
  activeRoute: string = '';
  navbarToggleSwitchService: NavbarToggleSwitchService;
  constructor( private router : Router, navbarToggleSwitchService : NavbarToggleSwitchService,){

    this.navbarToggleSwitchService = navbarToggleSwitchService;
  }

  ngOnInit(): void {
   
    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.userRole = [
        {
          name: 'Candidate Dashboard',
          togglName:'Switch To Employee Dashboard'
         
        },
       
      ]
    }

    if (this.userType == "Employee") {
      this.userRole = [
        {
          name: 'Employee Dashboard',
          togglName:'Switch To Candidate Dashboard'
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
    return this.navbarToggleSwitchService.getIsEmployeeDashboard();
  }

  toggleDashboard() {
    this.navbarToggleSwitchService.toggleDashboard();

    if (this.navbarToggleSwitchService.getIsEmployeeDashboard()) {
      this.router.navigate(['/employee/edashboard']);
    } else {
      this.router.navigate(['/candidate/dashboard']);
    }  
  }

}
