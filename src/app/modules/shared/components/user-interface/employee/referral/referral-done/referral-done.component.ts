import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-referral-done',
  templateUrl: './referral-done.component.html',
  styleUrls: ['./referral-done.component.scss']
})
export class ReferralDoneComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() raiseIssue: EventEmitter<any> = new EventEmitter<any>();
  @Input() reviewData:any = "";
  @Input() selectedReferral:any;
  @Input() empdetailsList:any="";
  @Input() userType:any;
  profileImage:any;


  finalRating: number = 0;
  noReviewReceived:string = "No review received from the candidate!!";
  candidateName:any;

  ngOnChanges() {
    if(this.empdetailsList?.length > 0)
    {
      this.candidateName = this.empdetailsList[0].name;
      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ?this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'    
    }
  }

  referralRaiseIssue(data:any) {
    this.raiseIssue.emit(data);
  }



}
