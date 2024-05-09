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
   console.log(this.userType)
   
   //debugger
   
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
    // return this.navbarToggleSwitchService.getIsEmployeeDashboard();
    // console.log("current toggle status", this.navbarToggleSwitchService.getCurrentDashboard());
    return this.navbarToggleSwitchService.getCurrentDashboard();
  }

  toggleDashboard() {

    this.navbarToggleSwitchService.toggleDashboard();

    if (this.navbarToggleSwitchService.getCurrentDashboard()) {
      console.log(this.userType)
      this.router.navigate(['/employee/Dashboard']);
     
      //debugger
    } else {
      console.log(this.userType)
      this.router.navigate(['/candidate/dashboard']);
      
    }  
  }

}
