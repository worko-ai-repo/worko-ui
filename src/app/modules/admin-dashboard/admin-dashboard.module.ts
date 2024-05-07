import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CandidateComponent } from './candidate/candidate.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AcandidateComponent } from './components/acandidate/acandidate.component';
import { FormsModule } from '@angular/forms';
import { AdashboardComponent } from './components/adashboard/adashboard.component';
import { AissuesComponent } from './components/aissues/aissues.component';


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
    AcandidateComponent,
    AissuesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminDashboardModule { }
