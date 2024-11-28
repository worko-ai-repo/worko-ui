import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CorporateComponent } from './corporate.component';
import { RouterModule, Routes } from '@angular/router';
import { CorporateDashboardComponent } from './components/corporate-dashboard/corporate-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AdminDashboardComponent } from '../admin/components/admin-dashboard/admin-dashboard.component';
import { AuthAdminGuardService } from '../worko/services/auth-admin-guard.service';
import { AdminCandidateComponent } from '../admin/components/admin-candidate/admin-candidate.component';
import { CorporateApplicantsComponent } from './components/corporate-applicants/corporate-applicants.component';
import { CorporateRecruiterComponent } from './components/corporate-recruiter/corporate-recruiter.component';
import { CorporateSettingsComponent } from './components/corporate-settings/corporate-settings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/corporate/home',
    pathMatch: 'full'
  },
{
    path: '',
    component: CorporateComponent,
    children: [
      {
        path: 'cJobs',
        component: CorporateDashboardComponent 
      },
      {
        path: 'cApplicants',
        component: CorporateDashboardComponent //Rename the Component 
      },
      {
        path: 'cRecruiter',
        component: CorporateRecruiterComponent 
      },
      {
        path: 'cSettings',
        component: CorporateSettingsComponent 
      },
    
    ]
  }
]

@NgModule({
  declarations: [
    CorporateComponent,
    CorporateDashboardComponent,
    CorporateApplicantsComponent,
    CorporateRecruiterComponent,
    CorporateSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule ,
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
export class CorporateModule { }
