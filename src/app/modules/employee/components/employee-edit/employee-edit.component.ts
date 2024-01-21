import { Component } from '@angular/core';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent {
  currentStep: number = 1;
  emailAddress: string = "";

  constructor( private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    //  this.addBankDetails()

  }

  nextStep() {
   
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    
    
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async addBankDetails() {
    let data = {
      "upiIds": [
          {
              "upiId": "8921641218@upi"
          }
      ],
      "bankDetails": [
          {
              "holderName": "John Doe",
              "accNumber": 1234567890,
              "bankName": "Sample Bank",
              "accType": "Savings",
              "ifscCode": "ABC12345"
          }
      ]
  }; 
    await this.empService.createBankDetails(this.emailAddress, data).then(async (response) => {
      if (response) {
       
        console.log(response);
      }
    })
  }
}
