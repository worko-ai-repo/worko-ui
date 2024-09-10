import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mini-job-portal-companies',
  templateUrl: './mini-job-portal-companies.component.html',
  styleUrls: ['./mini-job-portal-companies.component.scss']
})
export class MiniJobPortalCompaniesComponent {

  companyName!: string;
  jobDescription!:string;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  
  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const fullCategory = urlSegments.map(segment => segment.path).join('/');
      this.companyName = this.extractCompanyName(fullCategory);
      this.jobDescription = this.extractJobDescription(fullCategory);
    });
  }

  private extractCompanyName(fullCategory: string): string {
    // Extract the company name from the URL
    const companyMatch = fullCategory.match(/^([^-]+)-jobs/);
    return companyMatch ? this.formatCategory(companyMatch[1]) : '';
  }

  private extractJobDescription(fullCategory: string): string {
    // Extract the job description from the URL
    const jobDescriptionMatch = fullCategory.match(/-jobs\/(.+)/);
    return jobDescriptionMatch ? this.formatCategory(jobDescriptionMatch[1]) : '';
  }

  private formatCategory(category: string): string {
    // Decode URL components and replace hyphens with spaces
    return decodeURIComponent(category)
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}












