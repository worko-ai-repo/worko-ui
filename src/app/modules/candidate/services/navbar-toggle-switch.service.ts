import { Injectable } from '@angular/core';
import { StorageService } from '../../app-core/services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class NavbarToggleSwitchService {

  private localStoragekey = 'currentDashboardEnabled';
  // private isEmployeeDashboard:boolean = false;
  // private currentDashboard = this.storage.get('currentDashboardEnabled'); working way
  private currentDashboard = this.storage.get('lastAccessedDash')

  constructor(private storage: StorageService) {

    // const toggleStatus = localStorage.getItem(this.localStoragekey);
    // const toggleStatus = this.storage.get(this.localStoragekey);
    // if(toggleStatus) {
    //   this.isEmployeeDashboard = JSON.parse(toggleStatus);
    // }
    // else {
    //   localStorage.removeItem(this.localStoragekey);
    // }

    this.currentDashboard = this.storage.get('lastAccessedDash');
    //  console.log(this.currentDashboard)

  }

  getDashboard() {
    return this.currentDashboard;
  }

  setDashboard(userType: any) {
    this.currentDashboard = userType;
    this.storage.set('lastAccessedDash', this.currentDashboard);
  }

  intializeToggleStatus() {
    const toggleStatus = this.storage.get('lastAccessedDash');
    // this.storage.set(this.localStoragekey, toggleStatus); working way
    // console.log("from toggle switch service",this.storage.get('lastAccessedDash'));
    if (toggleStatus) {
      this.currentDashboard = toggleStatus;
      // console.log(this.currentDashboard);
    }
  }

  toggleDashboard(): void {

    // this.isEmployeeDashboard = !this.isEmployeeDashboard;
    if (this.currentDashboard === 'EMP') {
      this.currentDashboard = 'CAND';
    }
    else if (this.currentDashboard === 'CAND') {
      this.currentDashboard = 'EMP'
    }
    // localStorage.setItem(this.localStoragekey, JSON.stringify(this.isEmployeeDashboard));
    this.storage.set('lastAccessedDash', this.currentDashboard);
    // this.storage.set(this.localStoragekey, this.currentDashboard); working way
  }

  // getIsEmployeeDashboard(): boolean {

  //   return this.isEmployeeDashboard;

  // }

  getCurrentDashboard() {
    if (this.currentDashboard === 'EMP') {
      return true;
    }
    else if (this.currentDashboard === 'CAND') {
      return false;
    } else {
      return null;
    }
  }

  // toggleStatusFalse() {
  //   this.isEmployeeDashboard = false;
  // }
}
