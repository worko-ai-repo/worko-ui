import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-skills',
  templateUrl: './mini-job-portal-skills.component.html',
  styleUrls: ['./mini-job-portal-skills.component.scss']
})
export class MiniJobPortalSkillsComponent {

  @Input() jobDescriptionDetails:any;
  coreSkills: string[]=[]
  mislaneiousSkills: string[] = [];
  technicalSkills: string[] = [];
  otherRequirements: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobDescriptionDetails'] && changes['jobDescriptionDetails'].currentValue) {
      this.updateSkills();
    }
  }

  updateSkills(): void {
   this.coreSkills=this.jobDescriptionDetails.coreSkills
   this.mislaneiousSkills=this.jobDescriptionDetails.mislaneiousSkills
   this.technicalSkills=this.jobDescriptionDetails.technicalSkills
   this.otherRequirements=this.jobDescriptionDetails.otherRequirements
  }
  getJoinedSkills(skills: string[]): string {
    return skills.join(' | ');
  }
  
}
