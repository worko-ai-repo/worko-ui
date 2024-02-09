import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-referral-details',
  templateUrl: './employee-referral-details.component.html',
  styleUrls: ['./employee-referral-details.component.scss']
})
export class EmployeeReferralDetailsComponent {
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
  showCard: boolean = false;

  selectedStatus!: string; 

    // ...

    onStatusSelected(status: string): void {
        this.selectedStatus = status;
    }

    onAccept(): void {
        // Handle the accept logic
        console.log('Accepted');
    }

    onReject(): void {
      this.showCard = !this.showCard;
    }

    onLeave(): void {
        // Handle the leave logic
        console.log('Leave');
    }

}
