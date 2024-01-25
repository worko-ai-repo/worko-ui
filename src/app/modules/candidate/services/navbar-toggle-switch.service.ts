import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NavbarToggleSwitchService {

  private isEmployeeDashboard = false;

  toggleDashboard(): void {
   
    this.isEmployeeDashboard = !this.isEmployeeDashboard;
   
  }

  getIsEmployeeDashboard(): boolean {
    
    return this.isEmployeeDashboard;
   
  }
  constructor() { }
}
