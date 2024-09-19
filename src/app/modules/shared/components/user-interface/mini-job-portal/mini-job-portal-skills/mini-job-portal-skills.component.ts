import { Component } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-skills',
  templateUrl: './mini-job-portal-skills.component.html',
  styleUrls: ['./mini-job-portal-skills.component.scss']
})
export class MiniJobPortalSkillsComponent {

  coreSkills: string[] = ["Java", "REACT", "Three.js"];
  goodToHaveSkills: string[] = ["Team leader", "Analytics", "Partnership", "Performance marketing"];
  technicalSkills: string[] = ["Team leader", "Analytics", "Partnership", "Performance marketing"];
  otherRequirements: string[] = ["Must have from Healthcare Industry", "Preferred from Healthcare Industry", "Experience in Analytics is preferred"];

  getJoinedSkills(skills: string[]): string {
    return skills.join(' | ');
  }
  
}
