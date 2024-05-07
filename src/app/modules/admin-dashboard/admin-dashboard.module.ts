import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CandidateComponent } from './candidate/candidate.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AcandidateComponent } from './acandidate/acandidate.component';
import { FormsModule } from '@angular/forms';
import { AdashboardComponent } from './adashboard/adashboard.component';


export const routes: Routes = [
  // {
  //   path: '',
  //   component: AdminDashboardComponent
  // },
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: AdashboardComponent,
      },
      {
        path: 'candidate',
        component: AcandidateComponent,
        
      },
    ]
  }
]

@NgModule({
  declarations: [
    AcandidateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminDashboardModule { }
