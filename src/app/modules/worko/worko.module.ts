import { NgModule } from '@angular/core';
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
import { CompanyListingComponent } from '../app-core/components/company-box/company-listing/company-listing.component';
import { CompanyBoxComponent } from '../app-core/components/company-box/company-box.component';
import { SearchFilterComponent } from '../app-core/components/company-box/search-filter/search-filter.component';
import { TitleComponent } from '../app-core/components/company-box/title/title.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    component: WorkoComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
    
    
   

  ]
})
export class WorkoModule { }
