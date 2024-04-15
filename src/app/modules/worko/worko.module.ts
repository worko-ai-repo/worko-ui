import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './components/contact/contact.component';
import { WorkoComponent } from './worko.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { IndexHomeComponent } from './components/index-home/index-home.component';
import { JobSerchSectionComponent } from './components/job-serch-section/job-serch-section.component';
import { ReferralGuidenceComponent } from './components/referral-guidence/referral-guidence.component';
import { InsiderInsightComponent } from './components/insider-insight/insider-insight.component';
import { BenifitsSectionComponent } from './components/benifits-section/benifits-section.component';
import { CompaniesSectionComponent } from './components/companies-section/companies-section.component';
import { VedioAreaComponent } from './components/vedio-area/vedio-area.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { FooterComponent } from './components/footer/footer.component';
import { CompanyListingComponent } from './components/company-listing/company-listing.component';
import { CompanyBoxComponent } from '../app-core/components/company-box/company-box.component';
import { SearchFilterComponent } from '../app-core/components/company-box/search-filter/search-filter.component';
import { TitleComponent } from '../app-core/components/company-box/title/title.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, NgModel, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReferralRequestComponent } from './components/referral-request/referral-request.component';
import { SubscriptionPackComponent } from './components/subscription-pack/subscription-pack.component';
import { ReferralProgressBarComponent } from './components/referral-progress-bar/referral-progress-bar.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RequestGuidenceComponent } from './components/request-guidence/request-guidence.component';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
// import { CircleChartComponent } from './components/circle-chart/circle-chart.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { PublicSidebarComponent } from '../shared/components/public-profile/public-sidebar/public-sidebar.component';
import { HomeAboutUsComponent } from './components/home-about-us/home-about-us.component';
import { HomeFaqComponent } from './components/home-faq/home-faq.component';
import { HomeCorporateComponent } from './components/home-corporate/home-corporate.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { IndexComponent } from './components/index/index.component';
import { FaqCandidateComponent } from './components/faq-candidate/faq-candidate.component';
import { FaqRefereeComponent } from './components/faq-referee/faq-referee.component';
// import { MatInputModule } from '@angular/material/input';
export const routes: Routes = [
  {
    path: '',
    component: WorkoComponent,
    children: [
      // {
      //   path: 'index',
      //   component: HomeComponent
      // },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'navbar',
        component: NavbarComponent
      },
      {
        path: 'index-home',
        component: IndexHomeComponent
      },
      {
        path: 'jobSearch',
        component: JobSerchSectionComponent
      },
      {
        path: 'referralGuidence',
        component: ReferralGuidenceComponent
      },
      {
        path: 'insiderInsight',
        component: InsiderInsightComponent
      },
      {
        path: 'benifits',
        component: BenifitsSectionComponent
      },
      {
        path: 'companies',
         component: CompaniesSectionComponent
        
      },
      {
        path: 'vedioArea',
        component: VedioAreaComponent
      },
      {
        path: 'testimonial',
        component: TestimonialComponent
      },
      {
        path: 'footer',
        component: FooterComponent
      },
      {
        path : 'company-listing',
        component: CompanyListingComponent
      },
      {
        path : 'company-box',
        component: CompanyBoxComponent
      },
      {
        path : 'search-filter',
        component: SearchFilterComponent
      },
      {
        path : 'title',
        component: TitleComponent
      },
      {
        path : 'login',
        component: LoginPageComponent
      },
      {
        path : 'referral-req',
        component: ReferralRequestComponent
      },
      {
        path : 'subscript-pack',
        component: SubscriptionPackComponent
      },
      {
        path : 'progress-bar',
        component: ReferralProgressBarComponent
      },
      {
        path : 'req-guidence',
        component: RequestGuidenceComponent
      },
      {
        path : 'public-profile',
        component: PublicProfileComponent
      },
      {
        path : 'about-us',
        component: HomeAboutUsComponent
      },
      {
        path : 'faq',
        component: HomeFaqComponent
      },
      {
        path : 'corporate',
        component: HomeCorporateComponent
      },
      {
        path : 'terms-of-service',
        component: TermsOfServiceComponent
      },
      {
        path : 'refund-policy',
        component:RefundPolicyComponent 
      },
      {
        path : 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: '',
        component: IndexComponent
      },
      {
        path: 'faq-candidate',
        component: FaqCandidateComponent
      },
      {
        path: 'faq-referee',
        component: FaqRefereeComponent
      },
    ]
  }  
]

@NgModule({
  declarations: [
    ContactComponent,
    WorkoComponent,
    HomeComponent,
    NavbarComponent,
    IndexHomeComponent,
    JobSerchSectionComponent,
    ReferralGuidenceComponent,
    InsiderInsightComponent,
    BenifitsSectionComponent,
    CompaniesSectionComponent,
    VedioAreaComponent,
    CompanyListingComponent,
    TestimonialComponent,
    FooterComponent,
    CompanyBoxComponent,
    LoginPageComponent,
    ReferralRequestComponent,
    SubscriptionPackComponent,
    ReferralProgressBarComponent,
    RequestGuidenceComponent,
    // CircleChartComponent,
    PublicProfileComponent,
    HomeAboutUsComponent,
    HomeFaqComponent,
    HomeCorporateComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    IndexComponent,
    FaqCandidateComponent,
    FaqRefereeComponent
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SlickCarouselModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatListModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule

  ]
})
export class WorkoModule { }
