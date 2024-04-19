import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-referral-done',
  templateUrl: './referral-done.component.html',
  styleUrls: ['./referral-done.component.scss']
})
export class ReferralDoneComponent implements OnChanges {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() raiseIssue: EventEmitter<any> = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Input() reviewData: any = "";
  @Input() selectedReferral: any;
  @Input() empdetailsList: any = "";
  @Input() empEducationList: any = '';
  @Input() empExperienceList: any = "";
  @Input() empCoreSkillsDetails: any = '';
  @Input() userType: any;
  @Input() processStatus:any;
  referralRatingFlag:any = null;
  profileImage: any;
  scoreDetails: any = "";
  matchingScore: number = 0;
  score: number = 0;
  originalPoints = 2.1;
  possiblePoints = 10;
  isEmployeeReferralPage = true;


  finalRating: number = 0;
  noReviewReceived: string = "No review received from the candidate!!";
  candidateName: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedReferral);
    this.referralRatingFlag = null;

    if (this.processStatus) {
      this.checkRating();
    }

    if (this.selectedReferral?.matchingScore === 251 || this.selectedReferral?.matchingScore === 250) {
      this.matchingScore = 0;
    } else {
      this.matchingScore = this.selectedReferral?.matchingScore;
    }
    this.scoreDetails = this.selectedReferral?.scoreDetails;

    if (this.empdetailsList?.length > 0) {
      this.candidateName = this.empdetailsList[0].name;
      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ? this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'
    }
  }

  checkRating() {
    let flag = false;
    this.reviewData.forEach((element: any) => {
      if (element.ratingForUserType === 'CAND') {
        flag = true;
      }
    });
    this.referralRatingFlag = flag;
  }

  referralRaiseIssue(data: any) {
    this.raiseIssue.emit(data);
  }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit(reviewRatingData);
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // console.log(this.docResult.awsS3SignedUrl)


    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl, '_blank');
  }


}
