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
//import { UserMenubarComponent } from '../candidate/components/user-menubar/user-menubar.component';
import { CandidateModule } from '../candidate/candidate.module';
import { EmployeeModule } from '../employee/employee.module';
// import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthAdminGuardService } from '../worko/services/auth-admin-guard.service';
import { AdminJobsComponent } from './components/admin-jobs/admin-jobs/admin-jobs.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Rich Text Editor
import { NgxSummernoteModule } from 'ngx-summernote';
import { HttpClientModule } from '@angular/common/http';
import { AdminCompanyComponent } from './components/admin-company/admin-company.component';


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
      component: AdminDashboardComponent,canActivate:[AuthAdminGuardService]
      
    },
    {
      path: 'aCandidate',
     component:AdminCandidateComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aEmployee',
     component:AdminEmployeeComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aIssues',
     component:AdminIssuesComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aService',
     component:AdminServiceComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aPayment',
     component:AdminPaymentComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aRefer-Earn',
     component:AdminReferEarnComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aSetting',
     component:AdminSettingComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'aReferral',
     component:AdminReferralComponent,canActivate:[AuthAdminGuardService]

    },
    {
      path: 'ajobs',
      component:AdminJobsComponent,canActivate:[AuthAdminGuardService]
    },
    {
      path: 'aCompany',
      component:AdminCompanyComponent,canActivate:[AuthAdminGuardService]
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
    AdminJobsComponent,
    AdminCompanyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule ,
    CandidateModule,
    EmployeeModule,
    MatDatepickerModule,MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
