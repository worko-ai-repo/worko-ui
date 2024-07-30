import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent {
  @Input() workExperienceDetails: any;
  currentCompany: any ;
  previousCompanies: any ={};
  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");
    // if(this.bankInfo){
    //   this.bankInfo = this.bankInfo[0];
    // }'
     this.currentCompany = this.workExperienceDetails?.filter((company:any) => company.isCurrent);
    this.previousCompanies = this.workExperienceDetails?.filter((company: any) => !company.isCurrent);
    this.currentCompany?.forEach((company: any) => {
      company.experience = this.calculateExperience(company.experienceInMonths);
  });

  this.previousCompanies?.forEach((company: any) => {
      company.experience = this.calculateExperience(company.totalMonths);
  });

}

calculateExperience(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years ==1 && months ==1) {
      return `${years} year and ${months} month`;
  }else if (years >=2 && months >=2) {
    return `${years} years and ${months} months`;
} else if (years ==1 && months >=2) {
  return `${years} year and ${months} months`;
}  else if (years >=2 && months ==1) {
  return `${years} years and ${months} month`;
} 
  else if (years >=2) {
      return `${years} years`;
  }  else if (years ==1) {
    return `${years} year`;
}else if (months ==1) {
      return `${months} month`;
  } 
  else if (months >=2) {
    return `${months} months`;
}else{
  return `${months} month`; 
}
}



  showCurrentJob: boolean = true;




  toggleCard() {

    this.showCurrentJob = !this.showCurrentJob;


  }
}


