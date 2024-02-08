import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminCandidateComponent } from './components/admin-candidate/admin-candidate.component';
import { AdminEmployeeComponent } from './components/admin-employee/admin-employee.component';
import { AdminReferralComponent } from './components/admin-referral/admin-referral.component';
import { AdminServiceComponent } from './components/admin-service/admin-service.component';
import { AdminIssuesComponent } from './components/admin-issues/admin-issues.component';
import { AdminPaymentComponent } from './components/admin-payment/admin-payment.component';
import { AdminReferEarnComponent } from './components/admin-refer-earn/admin-refer-earn.component';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { SharedModule } from '../shared/shared.module';
import { UserMenubarComponent } from '../candidate/components/user-menubar/user-menubar.component';
import { CandidateModule } from '../candidate/candidate.module';
import { EmployeeModule } from '../employee/employee.module';
// import { MatPaginatorModule } from '@angular/material/paginator';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


export const routes: Routes = [
{
  path: '',
  redirectTo: '/admin/home',
  pathMatch: 'full'
},
{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'aDashboard',
      component: AdminDashboardComponent,
      
    },
    {
      path: 'aCandidate',
     component:AdminCandidateComponent,

    },
    {
      path: 'aEmployee',
     component:AdminEmployeeComponent,

    },
    {
      path: 'aIssues',
     component:AdminIssuesComponent,

    },
    {
      path: 'aService',
     component:AdminServiceComponent,

    },
    {
      path: 'aPayment',
     component:AdminPaymentComponent,

    },
    {
      path: 'aRefer-Earn',
     component:AdminReferEarnComponent,

    },
    {
      path: 'aSetting',
     component:AdminSettingComponent,

    },
    {
      path: 'aReferral',
     component:AdminReferralComponent,

    },
  ]
}

]

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminCandidateComponent,
    AdminEmployeeComponent,
    AdminReferralComponent,
    AdminServiceComponent,
    AdminIssuesComponent,
    AdminPaymentComponent,
    AdminReferEarnComponent,
    AdminSettingComponent,
    AdminComponent,
   
    
   
  ],
  imports: [
    CommonModule,
    SharedModule,
    CandidateModule,
    EmployeeModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
