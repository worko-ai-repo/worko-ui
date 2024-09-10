import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MiniJobPortalCompaniesComponent } from './components/mini-job-portal-companies/mini-job-portal-companies.component';
import { MiniJobPortalComponent } from './mini-job-portal.component';
import { WorkoModule } from '../worko/worko.module';
import { MiniJobPortalJobListingComponent } from './components/mini-job-portal-job-listing/mini-job-portal-job-listing.component';



export const routes: Routes = [

  {
    path: '',
    component: MiniJobPortalComponent,
    children: [

      {
        path: ':companyName-jobs',
        component: MiniJobPortalJobListingComponent
      },

      {
        path: ':companyName-jobs/:jd',
        component: MiniJobPortalCompaniesComponent
      },








    ]
  }
]

@NgModule({
  declarations: [
    MiniJobPortalComponent,
    MiniJobPortalCompaniesComponent,
    MiniJobPortalJobListingComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkoModule,


    RouterModule.forChild(routes),
  ]
})
export class MiniJobPortalModule { }
