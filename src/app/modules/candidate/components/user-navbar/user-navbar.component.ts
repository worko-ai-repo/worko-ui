import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent implements OnInit{
  @Input() userType: string = "";
  userRole: any;
  activeRoute: string = '';
  constructor( private router : Router){}

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.userRole = [
        {
          name: 'Candidate Dashboard',
        
         
        },
       
      ]
    }

    if (this.userType == "Employee") {
      this.userRole = [
        {
          name: 'Employee Dashboard',
         
        },
       
      ]
    }
  }
}
