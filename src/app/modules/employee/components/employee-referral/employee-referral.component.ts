import {  Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent {
  empReferralList: any = "";
  emailAddress: any = "";
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;

  constructor(private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getEmpReferral();
  }
  onStatusSelected(status: string): void {
    this.selectedStatus = status;
    this.getEmpReferral();
  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }


  async getEmpReferral() {
    let companySK = "01HH1S22K46FFMS7D2RNK2K2SX";
    await this.empService.getEmployeeReferral(this.emailAddress, companySK,  this.selectedStatus ).then(async (response) => {
      if (response) {
        this.empReferralList = response;
        console.log(this.empReferralList + '123');
      }
    })
  }

  showReferralDetails(data:any){
    this.selectedReferral = data;
  }

}
