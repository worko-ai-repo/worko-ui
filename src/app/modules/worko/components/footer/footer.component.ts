import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as industryTypes from '../../../../../assets/industry-types.json';
import { environment } from 'src/environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  displayIndustriesAndCompanies: boolean = false;
  industryTypeOptions: any[] = (industryTypes as any).default;
  currentYear!: number;
  private routeSub!: Subscription;
  // baseUrl=window.location.origin;

  industryName = [
    { name: 'ACCENTURE' },
    { name: 'AUDI' },
    { name: 'BHARATPE' },
    { name: 'SPINNY' },
    { name: 'GROWW' },
    { name: 'AMADEUS' },
    { name: 'MAMAEARTH' },
    { name: 'SLICE' },
    { name: 'SWIGGY' },
    { name: 'CULT.FIT' },
    { name: 'AMAZON' },
    { name: 'OFBUSINESS' },
    { name: 'PHARMEASY' },
    { name: 'GUPSHUP' },
    { name: 'COINDCX' },
    { name: 'DROOM' },
    { name: 'CHARGEBEE' },
    { name: 'INNOVACCER' },
  ]

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.checkRoute();

    // Subscribe to router events and check only after NavigationEnd events
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });

    // Fetch industry types from the local JSON file
    this.http.get<any[]>('assets/industry-types.json').subscribe(data => {
      this.industryTypeOptions = data;
    });
    this.currentYear = new Date().getFullYear();
  }

  checkRoute(): void {
    const url = this.router.url;
    if (url.includes('/company') || url.includes('-jobs')) {
      this.displayIndustriesAndCompanies = true;  // show on specific routes
    } else {
      this.displayIndustriesAndCompanies = false;   // hide on all other routes
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe route subscription here
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  viewAllCompanies() {
    // Check if the current URL is '/company'
    if (this.router.url === '/company') {
      // If so, reload the page
      window.location.reload();
    } else {
      // Navigate to '/company' if not on that route
      this.router.navigate(['/company']);
    }
  }
  // async redirectToCompanyListing() {

  //   window.location.href = window.location.origin + '/companies';
  // }

  // baseUrl = environment.crossOriginUrl;
  // rediectToContactUs() {
  // window.location.href = environment.crossOriginUrl + '/contact-us'
  // }
  // rediectToRefundPolicy() {
  // window.location.href = environment.crossOriginUrl + '/refund-policy'
  // }
  // rediectToPrivacyPolicy() {
  // window.location.href = environment.crossOriginUrl + '/privacy-policy'
  // }
  // rediectToFaq() {
  //   window.location.href = environment.crossOriginUrl + '/faq'
  // }
  // rediectToAboutUs() {
  //   window.location.href = environment.crossOriginUrl + '/about-us'
  // }

}
