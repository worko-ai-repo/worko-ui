import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-referral-done',
  templateUrl: './referral-done.component.html',
  styleUrls: ['./referral-done.component.scss']
})
export class ReferralDoneComponent implements OnChanges {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() raiseIssue: EventEmitter<any> = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Input() reviewData:any = "";
  @Input() selectedReferral:any;
  @Input() empdetailsList:any="";
  @Input() userType:any;
  referralRatingFlag = false;
  profileImage:any;


  finalRating: number = 0;
  noReviewReceived:string = "No review received from the candidate!!";
  candidateName:any;

  ngOnChanges() {
    console.log(this.selectedReferral);
    if (this.reviewData?.length > 0) {
      this.checkRating();
    }
    if(this.empdetailsList?.length > 0)
    {
      this.candidateName = this.empdetailsList[0].name;
      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ?this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'    
    }
  }

  checkRating() {
    this.referralRatingFlag = false;
    this.reviewData.forEach((element:any) => {
      if (element.ratingForUserType === 'CAND') {
        this.referralRatingFlag = true;
      }
    });
  }

  referralRaiseIssue(data:any) {
    this.raiseIssue.emit(data);
  }

  referralReviewRating(reviewRatingData:any) {
    this.referralRating.emit(reviewRatingData);
  }



}
