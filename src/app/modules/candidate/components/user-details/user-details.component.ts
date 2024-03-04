import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";
  @Input() workExperienceDetails: any = "";
  
  recentGraduation: any;
  profileImage: string = "/assets/public/candidate-img.png";
  constructor() { }

  ngOnInit(): void {

}


ngOnChanges(): void {
  // console.log(this.workExperienceDetails, "workExperienceDetails");

  if(this.workExperienceDetails?.length){
    this.workExperienceDetails = this.workExperienceDetails[0];
  }
this.profileImage = this.candidateDetails?.profileImageAwsS3SignedUrl ?this.candidateDetails?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'
}
}