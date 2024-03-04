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
  profileImage: string = "/assets/public/candidate-img.png";
  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
  
    if(this.workExperienceDetails?.length){
      this.workExperienceDetails = this.workExperienceDetails[0];
    }
    this.profileImage = this.candidateDetails?.profileImageAwsS3SignedUrl ?this.candidateDetails?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'
  }
}
