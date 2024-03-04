import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NavbarToggleSwitchService {

  private localStoragekey = 'isEmployeeDashboardEnabled';
  private isEmployeeDashboard = false;

  constructor() {
    const toggleStatus = localStorage.getItem(this.localStoragekey);
    if(toggleStatus) {
      this.isEmployeeDashboard = JSON.parse(toggleStatus);
    }
    else {
      localStorage.removeItem(this.localStoragekey);
    }
  }

  toggleDashboard(): void {
   
    this.isEmployeeDashboard = !this.isEmployeeDashboard;
    localStorage.setItem(this.localStoragekey, JSON.stringify(this.isEmployeeDashboard));

  }

  getIsEmployeeDashboard(): boolean {
    
    return this.isEmployeeDashboard;
   
  }
}
