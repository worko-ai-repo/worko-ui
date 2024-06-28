import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-add-bank-details',
  templateUrl: './add-bank-details.component.html',
  styleUrls: ['./add-bank-details.component.scss']
})
export class AddBankDetailsComponent {
  @Output() previousStep = new EventEmitter<void>();
  @Input() bankInfo: any;
  @Output() onSuccess = new EventEmitter<void>();
  @Input() employeeBankDetails: any;

  ngOnChanges(): void {

    if (this.employeeBankDetails && this.employeeBankDetails.ifscCode && this.employeeBankDetails.holderName  && this.employeeBankDetails.accNumber) {

    } else {
      this.getData();
    }
    // console.log(this.candidateProfessionalDetails)
  }
  getData() {

    this.employeeBankDetails = {
      holderName: this.bankInfo[0]?.bankDetails[0].holderName,
      accNumber: this.bankInfo[0]?.bankDetails[0].accNumber,
      bankName: this.bankInfo[0]?.bankDetails[0].bankName,
      accType: this.bankInfo[0]?.bankDetails[0].accType,
      ifscCode: this.bankInfo[0]?.bankDetails[0].ifscCode,
      confirmAccNumber: this.bankInfo[0]?.bankDetails[0].accNumber,
      upiId: this.bankInfo[0]?.upiIds[0].upiId,

    }
   
  }


  onPreviousClick() {
    this.previousStep.emit(this.employeeBankDetails);
  }

  completeStep() {
    this.onSuccess.emit(this.employeeBankDetails)
  }
}
