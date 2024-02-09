import { Component } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from 'src/app/modules/employee/services/employee-profile.service';
@Component({
  selector: 'app-edit-bank-details',
  templateUrl: './edit-bank-details.component.html',
  styleUrls: ['./edit-bank-details.component.scss']
})
export class EditBankDetailsComponent {
  employeeBankDetails: any = {
    bankName : "",
    upiId: "",
    ifscCode: "",
    holderName: "",
    accNumber:"",
    accType:"",
    
  };
  emailAddress: string = this.storage.get("useremail");
  constructor( private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getBankDetails();


  }


  completeStep() {
    // this.onSuccess.emit(this.employeeBankDetails)
  }

  async getBankDetails() {
    await this.empService.getBankDetails(this.emailAddress).then(async (response: any) => {
      if (response) {
        this.employeeBankDetails = response[0];

      }
    })
  }
}
