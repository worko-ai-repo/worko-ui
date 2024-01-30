import { Component } from '@angular/core';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent {
  currentStep: number = 1;
  emailAddress: string = "";
  // employeeList:any[]=[];
  employeeSocial:any[]=[];
  employeeDetails:any[]=[];

  constructor(private empService: EmployeeProfileService, private candidateSrv: CandidateProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getEmployeeDetails();
   

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
  // Get API //
  async getEmployeeDetails() {
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.employeeDetails = response[0];
        await this.getSocialProfile();
        
      }
    })
  }
  async getSocialProfile() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.employeeSocial = response[0];
       
      }
    });
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
