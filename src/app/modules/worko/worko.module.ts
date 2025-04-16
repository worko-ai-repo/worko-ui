import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkoComponent } from './worko.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { ReferralGuidenceComponent } from './components/referral-guidence/referral-guidence.component';
import { FooterComponent } from './components/footer/footer.component';
import { CompanyListingComponent } from './components/company-listing/company-listing.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, NgModel, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReferralRequestComponent } from './components/referral-request/referral-request.component';
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
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { PublicSidebarComponent } from '../shared/components/public-profile/public-sidebar/public-sidebar.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { IndexComponent } from './components/index/index.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { JobCategoryComponent } from './components/job-category/job-category.component';
import { jobCategoryMatcher } from './matchers/custom-route-matcher';
import { AccountSwitcherComponent } from './components/account-switcher/account-switcher.component';
import { AuthRouteGuardService } from './services/auth-route-guard.service';
import { AuthAdminGuardService } from './services/auth-admin-guard.service';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CorporateComponent } from './components/corporate/corporate.component';
import { FaqComponent } from './components/faq/faq.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MiniJobPortalJobListingComponent } from './components/mini-job-portal/mini-job-portal-job-listing/mini-job-portal-job-listing.component';
import { MiniJobPortalJobDescriptionComponent } from './components/mini-job-portal/mini-job-portal-job-description/mini-job-portal-job-description.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';





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
        path: '',
        component: IndexComponent
      },
      // {
      //   path : 'login',
      //   component: LoginPageComponent
      // },
      // {
      //   path : 'company',
      //   component: CompanyListingComponent
      // },
      // { path: ':category-jobs', component: JobCategoryComponent },
      // { 
      //   matcher: jobCategoryMatcher,
      //   component: JobCategoryComponent 
      // },
      {
        path : 'switcher',
        component:AccountSwitcherComponent ,canActivate:[AuthAdminGuardService]
      },
      // {
      //   path: 'contact-us',
      //   component: ContactUsComponent
      // },
      // {
      //   path: 'refund-policy',
      //   component: RefundPolicyComponent
      // },
      // {
      //   path : 'faq',
      //   component: FaqComponent
      // },
      // {
      //   path : 'corporate',
      //   component: CorporateComponent,
      //   // data: {
      //   //   title: 'Enhance Your Hiring with Peer-to-Peer Referrals',
      //   //   description: 'Join Worko’s Peer-to-Peer Referral Network to streamline your hiring process. Connect with top talent through verified referrals and boost your recruitment efficiency.',
      //   //   tags: 'Worko.ai, Peer-to-Peer Referrals, Recruitment Solutions, Employee Referrals, Talent Acquisition, Hiring Network, Worko Corporate Services, Streamlined Recruitment, Verified Referrals'
      //   // }
      // },
      // {
      //   path : 'about-us',
      //   component: AboutUsComponent
      // },
      // {
      //   path : 'terms-of-service',
      //   component: TermsOfServiceComponent
      // },
      // {
      //   path : 'privacy-policy',
      //   component: PrivacyPolicyComponent,
      // },
      // {
      //   path: 'company/jobs/:companyName-jobs-:companyID',
      //   component: MiniJobPortalJobListingComponent
      // },

      // {
      //   path: 'company/jobs/:companyName-jobs/:jobTitle-:jobID',
      //   component: MiniJobPortalJobDescriptionComponent
      // },
      // {
      //   path: 'contact',
      //   component: ContactComponent
      // },
      // {
      //   path: 'navbar',
      //   component: NavbarComponent
      // },
      // {
      //   path: 'index-home',
      //   component: IndexHomeComponent
      // },
      // {
      //   path: 'jobSearch',
      //   component: JobSerchSectionComponent
      // },
      // {
      //   path: 'referralGuidence',
      //   component: ReferralGuidenceComponent
      // },
      // {
      //   path: 'insiderInsight',
      //   component: InsiderInsightComponent
      // },
      // {
      //   path: 'benifits',
      //   component: BenifitsSectionComponent
      // },
      // {
      //   path: 'companies',
      //    component: CompaniesSectionComponent
        
      // },
      // {
      //   path: 'vedioArea',
      //   component: VedioAreaComponent
      // },
      // {
      //   path: 'testimonial',
      //   component: TestimonialComponent
      // },
      // {
      //   path: 'footer',
      //   component: FooterComponent
      // },
      // {
      //   path : 'company-box',
      //   component: CompanyBoxComponent
      // },
      // {
      //   path : 'search-filter',
      //   component: SearchFilterComponent
      // },
      // {
      //   path : 'title',
      //   component: TitleComponent
      // },
    
      // {
      //   path : 'referral-req',
      //   component: ReferralRequestComponent
      // },
      // {
      //   path : 'subscript-pack',
      //   component: SubscriptionPackComponent
      // },
      // {
      //   path : 'progress-bar',
      //   component: ReferralProgressBarComponent
      // },
      // {
      //   path : 'req-guidence',
      //   component: RequestGuidenceComponent
      // },
      // {
      //   path : 'public-profile',
      //   component: PublicProfileComponent
      // },
      // {
      //   path: 'faq-candidate',
      //   component: FaqCandidateComponent
      // },
      // {
      //   path: 'faq-referee',
      //   component: FaqRefereeComponent
      // },
    ]
  }  
]

@NgModule({
    providers: [],
    declarations: [
        WorkoComponent,
        HomeComponent,
        NavbarComponent,
        ReferralGuidenceComponent,
        CompanyListingComponent,
        FooterComponent,
        LoginPageComponent,
        ReferralRequestComponent,
        ReferralProgressBarComponent,
        RequestGuidenceComponent,
        // CircleChartComponent,
        PublicProfileComponent,
        TermsOfServiceComponent,
        IndexComponent,
        ContactUsComponent,
        JobCategoryComponent,
        AccountSwitcherComponent,
        AboutUsComponent,
        CorporateComponent,
        FaqComponent,
        PrivacyPolicyComponent,
        RefundPolicyComponent,
        LoginFormComponent,
        MiniJobPortalJobListingComponent,
        MiniJobPortalJobDescriptionComponent,
        PageNotFoundComponent
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
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
        // SlickCarouselModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatListModule,
        MatNativeDateModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
    ]
})
export class WorkoModule { }
