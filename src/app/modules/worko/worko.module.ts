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
      {
        path : 'login',
        component:IndexComponent
      },
      {
        path : 'companies',
        component: CompanyListingComponent
      },
      // { path: ':category-jobs', component: JobCategoryComponent },
      { 
        matcher: jobCategoryMatcher,
        component: JobCategoryComponent 
      },
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
      //   path : 'about-us',
      //   component: HomeAboutUsComponent
      // },
      // {
      //   path : 'faq',
      //   component: HomeFaqComponent
      // },
      // {
      //   path : 'corporate',
      //   component: HomeCorporateComponent
      // },
      {
        path : 'terms-of-service',
        component: TermsOfServiceComponent
      },
      // {
      //   path : 'refund-policy',
      //   component:RefundPolicyComponent 
      // },
      // {
      //   path : 'privacy-policy',
      //   component: PrivacyPolicyComponent
      // },
    
      // {
      //   path: 'faq-candidate',
      //   component: FaqCandidateComponent
      // },
      // {
      //   path: 'faq-referee',
      //   component: FaqRefereeComponent
      // },
      // {
      //   path : 'contact-us',
      //   component:ContactUsComponent 
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
        JobCategoryComponent
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
