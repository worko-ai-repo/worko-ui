import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent {
  @Input() workExperienceDetails: any;

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    // if(this.bankInfo){
    //   this.bankInfo = this.bankInfo[0];
    // }
  }
  showCurrentJob: boolean = true;

  toggleCard() {
    this.showCurrentJob = !this.showCurrentJob;
  }
}
