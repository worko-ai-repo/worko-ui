import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as industryTypes from '../../../../../assets/industry-types.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
 
  
  industryTypeOptions: any[] = (industryTypes as any).default;
  // baseUrl=window.location.origin;

  industryName=[
    {name:'ACCENTURE'},
    {name:'AUDI'},
    {name:'BHARATPE'},
    {name:'SPINNY'},
    {name:'GROWW'},
    {name:'AMADEUS'},
    {name:'MAMAEARTH'},
    {name:'SLICE'},
    {name:'SWIGGY'},
    {name:'CULT.FIT'},
    {name:'AMAZON'},
    {name:'OFBUSINESS'},
    {name:'PHARMEASY'},
    {name:'GUPSHUP'},
    {name:'COINDCX'},
    {name:'DROOM'},
    {name:'CHARGEBEE'},
    {name:'INNOVACCER'},
  ]

  constructor(private http: HttpClient){}

  async ngOnInit() {
    this.http.get<any[]>('assets/industry-types.json').subscribe(data => {
      this.industryTypeOptions = data;
    });
  }
  async redirectToCompanyListing() {

    window.location.href = window.location.origin + '/companies';
  }

baseUrl = environment.crossOriginUrl;
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
