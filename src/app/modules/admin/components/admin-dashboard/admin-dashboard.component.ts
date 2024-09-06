import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  filterModel: any = {
    fromData: "",
    toDate: "",
    lifetime: '',
  }

  applyToDateFilters() {
    throw new Error('Method not implemented.');
  }


  applyFromDateFilters() {
    throw new Error('Method not implemented.');
  }

  toggleDateFilters() {
    if (this.filterModel.lifetime) {
      this.filterModel.fromDate = null;
      this.filterModel.toDate = null;
    }
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.applyFromDateFilters();
    this.applyToDateFilters();
  }

}
