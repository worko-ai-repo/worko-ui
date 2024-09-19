import { Component } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-otherjob',
  templateUrl: './mini-job-portal-otherjob.component.html',
  styleUrls: ['./mini-job-portal-otherjob.component.scss']
})
export class MiniJobPortalOtherjobComponent {
  jobListings = [
    {
      title: "Monitoring And Evaluation Officer - HCLTech",
      location: "Hyderabad",
      experience: "2-3 years"
    },
    {
      title: "Data Analyst - ABC Corp",
      location: "Bangalore",
      experience: "3-4 years"
    }
  
  ];
}
