import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";
  @Input() workExperienceDetails: any ;
  profileImage: string = "/assets/public/candidate-img.png";
  currentCompany: any ;
  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    if (this.workExperienceDetails && this.workExperienceDetails.length) {
     // this.workExperienceDetails = this.workExperienceDetails[0];
      this.currentCompany = this.workExperienceDetails?.filter((company:any) => company.isCurrent);
      this.currentCompany=this.currentCompany[0];
    }

 
    this.profileImage = this.candidateDetails?.profileImageAwsS3SignedUrl ?this.candidateDetails?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png';
  }

}
