import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../services/cognito.service';
import { signOut } from '@aws-amplify/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  userType = "Admin";
  isSidebarExpanded: boolean = true;
  constructor() {
    // Empty constructor
  }

  ngOnInit(): void {
    // No logic needed
  }

  /**
   * Toggle sidebar.
   *
   * @returns {void}
   */
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

}
