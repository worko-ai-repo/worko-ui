import { Injectable } from '@angular/core';
import { StorageService } from '../../app-core/services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class NavbarToggleSwitchService {

  private localStoragekey = 'isEmployeeDashboardEnabled';
  private isEmployeeDashboard:boolean = false;

  constructor(private storage: StorageService) {
    // const toggleStatus = localStorage.getItem(this.localStoragekey);
    const toggleStatus = this.storage.get(this.localStoragekey);
    if(toggleStatus) {
      this.isEmployeeDashboard = JSON.parse(toggleStatus);
    }
    // else {
    //   localStorage.removeItem(this.localStoragekey);
    // }
  }

  toggleDashboard(): void {
   
    this.isEmployeeDashboard = !this.isEmployeeDashboard;
    // localStorage.setItem(this.localStoragekey, JSON.stringify(this.isEmployeeDashboard));
    this.storage.set(this.localStoragekey, JSON.stringify(this.isEmployeeDashboard));

  }

  getIsEmployeeDashboard(): boolean {
    
    return this.isEmployeeDashboard;
   
  }

  toggleStatusFalse() {
    this.isEmployeeDashboard = false;
  }
}
