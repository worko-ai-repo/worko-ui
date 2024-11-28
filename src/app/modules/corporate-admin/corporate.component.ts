import { Component } from '@angular/core';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent {
  userType = "Corporate";
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