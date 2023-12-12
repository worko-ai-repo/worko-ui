import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { candidateGuard } from './guards/candidate.guard'; 




export const routes: Routes = [

  {
    path: '',
    component: CandidateComponent,
    children: [
      {
        path: 'candidate-dashboard',
        component: CandidateDashboardComponent,
        canActivate: [ candidateGuard]
      },
      
      
      
      
      
      
    ]
  }  
]

@NgModule({
  declarations: [
   CandidateDashboardComponent,
  CandidateComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CandidateModule { }
