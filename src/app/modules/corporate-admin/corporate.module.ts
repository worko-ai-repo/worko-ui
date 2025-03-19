import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CorporateComponent } from './corporate.component';
import { RouterModule, Routes } from '@angular/router';
import { CorporateJobsComponent } from './components/corporate-jobs/corporate-jobs.component';
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
import { CorporateJobApplicationDetailComponent } from './components/corporate-job-application-detail/corporate-job-application-detail.component';
import { CorporateUsersComponent } from './components/corporate-users/corporate-users.component';
import { CorporateUserSettingsComponent } from './components/corporate-user-settings/corporate-user-settings.component';
import { CorporateInvitesComponent } from './components/corporate-invites/corporate-invites.component';
import { AuthAdminGuardService } from '../worko/services/auth-admin-guard.service';
import { AuthCoporateGuardService } from '../worko/services/auth-coporate-guard.service';
import { CorporateApplicantsComponent } from './components/corporate-applicants/corporate-applicants.component';
import { ResumeScreenerPageComponent } from './components/resume-screener/resume-screener-page/resume-screener-page.component';
import { ResumeMatchTableComponent } from './components/resume-screener/resume-match-table/resume-match-table.component';
import { ResumeScreeningListViewComponent } from './components/resume-screener/resume-screening-list-view/resume-screening-list-view.component';

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
        component: CorporateJobsComponent, canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cApplicants',
        component: CorporateApplicantsComponent,
        canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cApplicants/:id',
        component: CorporateApplicantsComponent,
        canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cManageUsers',
        component: CorporateUsersComponent, canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cInvites',
        component: CorporateInvitesComponent, canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cSettings',
        component: CorporateUserSettingsComponent, canActivate: [AuthCoporateGuardService]
      },
      {
        path: 'cCandidateScreener/cNewScreening',
        component: ResumeScreenerPageComponent,
        canActivate: [AuthCoporateGuardService],
      },
      {
        path: 'cCandidateScreener/cScreeningList',
        component: ResumeScreeningListViewComponent,
        canActivate: [AuthCoporateGuardService],
      },
      {
        path: 'cCandidateScreener/cMatchingResult/:id',
        component: ResumeMatchTableComponent,
        canActivate: [AuthCoporateGuardService],
      },
      {
        path: 'cCandidateScreener', 
        redirectTo: 'cCandidateScreener/cNewScreening', 
        pathMatch: 'full',
      },
      // {
      //   path: 'cCandidateScreener',
      //   component: ResumeScreenerPageComponent,
      //   canActivate: [AuthCoporateGuardService],
      //   children: [
      //     {
      //       path: 'cNewScreening',
      //       component: ResumeScreenerPageComponent, // or another component if applicable
      //       canActivate: [AuthCoporateGuardService],
      //     },
      //     {
      //       path: 'cScreeningList',
      //       component: ResumeScreeningListViewComponent,
      //       canActivate: [AuthCoporateGuardService],
      //     },
      //     {
      //       path: 'cMatchingResult/:id',
      //       component: ResumeMatchTableComponent,
      //       canActivate: [AuthCoporateGuardService],
      //     },
      //     {
      //       path: '',
      //       redirectTo: 'cNewScreening', // Default redirection to `cNewScreening` when accessing `cCandidateScreener`
      //       pathMatch: 'full',
      //     },
      //   ],
      // },
      // {
      //   path: '',
      //   component: ScreenedListComponent, canActivate:[AuthCoporateGuardService]
      // }
      // {
      //   path: 'cMatchingResult',
      //   component: ResumeMatchTableComponent, canActivate: [AuthCoporateGuardService]
      // },
      // {
      //   path: 'cMatchingResult/:id',
      //   component: ResumeMatchTableComponent, canActivate: [AuthCoporateGuardService]
      // },
      // {
      //   path: 'cScreeningList',
      //   component: ResumeScreeningListViewComponent, canActivate: [AuthCoporateGuardService]
      // }
    ]
  }
]

@NgModule({
  declarations: [
    CorporateComponent,
    CorporateJobsComponent,
    CorporateJobApplicationDetailComponent,
    CorporateUsersComponent,
    CorporateUserSettingsComponent,
    CorporateInvitesComponent,
    CorporateApplicantsComponent,
    ResumeScreenerPageComponent,
    ResumeMatchTableComponent,
    ResumeScreeningListViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
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
