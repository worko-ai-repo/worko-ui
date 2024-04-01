import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-employee-referral-details',
  templateUrl: './employee-referral-details.component.html',
  styleUrls: ['./employee-referral-details.component.scss']
})
export class EmployeeReferralDetailsComponent implements OnChanges {
  @Input()empdetailsList:any="";
  @Input()empEducationList:any="";
  @Input()empExperienceList:any="";
  @Input()empCoreSkillsList:any="";
  @Input()empAchievmentsList:any="";
  @Input() empDetails:any={};
  @Input()empEducationDetails:any={};
  @Input()empAchievmentsDetails:any={};
  @Input()empCoreSkillsDetails:any={};
  @Input()empExperienceDetails:any={};
  @Input()selectedStatus:any;
  @Output() onAccept = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  showCard: boolean = false;
  profileImage:any;

  // selectedStatus!: string; 

  //   // ...

  //   onStatusSelected(status: string): void {
  //       this.selectedStatus = status;
  //   }

    acceptBtn() {
        // Handle the accept logic
        this.onAccept.emit();
        console.log('Accepted');
    }

    rejectBtn(): void {
      this.onReject.emit();
      this.showCard = !this.showCard;
    }

    onLeave(): void {
        // Handle the leave logic
        console.log('Leave');
    }

    ngOnChanges(): void {
      console.log(this.empExperienceList[0]?.department);
      console.log(this.empdetailsList[0]?.CTC);
      console.log(this.empdetailsList[0]?.noticePeriod);
      console.log(this.empdetailsList[0]?.ECTC);
      console.log(this.empCoreSkillsDetails[0]?.coreSkills);
      console.log(this.empCoreSkillsDetails[0]?.certifications);
      console.log(this.selectedStatus);

      if(this.empdetailsList?.length>0)
      {

      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ?this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'

      }

    }

}
