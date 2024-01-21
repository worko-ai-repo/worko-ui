import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  @Input() bankInfo: any;

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
  
    // if(this.bankInfo){
    //   debugger;
    //   this.bankInfo = this.bankInfo[0];
    // }
  }

}
