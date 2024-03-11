import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent {
  @Input() workExperienceDetails: any;
<<<<<<< HEAD
  // filteredData:any=[];

=======
  currentCompany: any = {};
  previousCompanies: any ={};
>>>>>>> 1c0ecf3417bc6c4e98741f7a0ae1192bd76f67d9
  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    // if(this.bankInfo){
    //   this.bankInfo = this.bankInfo[0];
    // }'
     this.currentCompany = this.workExperienceDetails.filter((company:any) => company.isCurrent);
    this.previousCompanies = this.workExperienceDetails.filter((company: any) => !company.isCurrent);
    console.log(  this.currentCompany );
    console.log(  this.previousCompanies );
  }
  showCurrentJob: boolean = true;




  toggleCard() {

    this.showCurrentJob = !this.showCurrentJob;
<<<<<<< HEAD
    // const filteredData = this.workExperienceDetails.filter((item: { isCurrent: boolean }) => !item.isCurrent);
=======


>>>>>>> 1c0ecf3417bc6c4e98741f7a0ae1192bd76f67d9
  }
}
