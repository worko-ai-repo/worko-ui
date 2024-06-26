import { Component, Input } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from 'src/app/modules/employee/services/employee-profile.service';
@Component({
  selector: 'app-edit-bank-details',
  templateUrl: './edit-bank-details.component.html',
  styleUrls: ['./edit-bank-details.component.scss']
})
export class EditBankDetailsComponent {
  @Input() bankInfo: any = "";
  
  // employeeBankDetails: any = {
  //   bankName : "",
  //   upiId: "",
  //   ifscCode: "",
  //   holderName: "",
  //   accNumber:"",
  //   accType:"",
    
  // };
  employeeBankDetails: any = {};
  emailAddress: string = this.storage.get("useremail");
  constructor( private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    // this.getBankDetails();


  }
  ngOnChanges(): void {
   
    // if(this.bankInfo){
    //   this.employeeBankDetails = this.bankInfo;
    // }
    this.getData();
  }

  getData(){
    this.employeeBankDetails = {
      bankName:this.bankInfo?.bankDetails[0].bankName,
      ifscCode:this.bankInfo?.bankDetails[0].ifscCode,
      holderName:this.bankInfo?.bankDetails[0].holderName,
      accNumber:this.bankInfo?.bankDetails[0].accNumber,
      accType:this.bankInfo?.bankDetails[0].accType,
      confirmAccNumber:this.bankInfo?.bankDetails[0].accNumber,
      upiId:this.bankInfo?.upiIds[0].upiId,
      SK: this.bankInfo?.SK,
      PK: this.bankInfo?.PK
    }
  }


  completeStep() {
    // this.onSuccess.emit(this.employeeBankDetails)
    this.addBankDetails();
  }

  async getBankDetails() {
    await this.empService.getBankDetails(this.emailAddress).then(async (response: any) => {
      if (response) {
        this.employeeBankDetails = response[0];

      }
    })
  }

  async addBankDetails() {
    let data = {
      "upiIds": [
        {
          "upiId":  this.employeeBankDetails.upiId
        }
      ],
      SK: this.employeeBankDetails?.SK,
      PK: this.employeeBankDetails?.PK,
      "bankDetails": [
        {
          "holderName": this.employeeBankDetails.holderName,
          "accNumber":  this.employeeBankDetails.accNumber,
          "bankName":  this.employeeBankDetails.bankName,
          "accType":  this.employeeBankDetails.accType,
          "ifscCode":  this.employeeBankDetails.ifscCode
        }
      ]
    };
    await this.empService.createBankDetails(this.emailAddress, data).then(async (response) => {
      if (response) {

      }
    })
  }
}
