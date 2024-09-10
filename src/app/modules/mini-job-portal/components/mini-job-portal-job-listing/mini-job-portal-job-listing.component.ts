import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mini-job-portal-job-listing',
  templateUrl: './mini-job-portal-job-listing.component.html',
  styleUrls: ['./mini-job-portal-job-listing.component.scss']
})
export class MiniJobPortalJobListingComponent {

  companyname!: string;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  
  async ngOnInit() {
  
    //extract the compant name from url
    this.route.url.subscribe(urlSegments => {
      const fullCategory = urlSegments.map(segment => segment.path).join('/');
      this.companyname = this.extractCategory(fullCategory);
    });

  
  }

  
  private extractCategory(fullCategory: string): string {
    // Remove '-jobs' from the end of the string
    let category = fullCategory.replace(/-jobs$/, '');

    // Replace dashes '-' with spaces ' ' and capitalize each word
    category = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return category;
  }
}
