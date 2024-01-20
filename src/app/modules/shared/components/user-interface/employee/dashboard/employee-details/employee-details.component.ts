import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";
  @Input() workExperienceDetails: any = "";

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
  
    if(this.workExperienceDetails?.length){
      this.workExperienceDetails = this.workExperienceDetails[0];
    }
  }
}
