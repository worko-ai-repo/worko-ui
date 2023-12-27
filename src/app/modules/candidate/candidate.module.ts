import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { candidateGuard } from './guards/candidate.guard';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';
import { UserMenubarComponent } from './components/user-menubar/user-menubar.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserProfileCompleteComponent } from './components/user-profile-complete/user-profile-complete.component';
import { UserSoftSkillsComponent } from './components/user-soft-skills/user-soft-skills.component';
import { UserAboutComponent } from './components/user-about/user-about.component';
import { UserSkillsComponent } from './components/user-skills/user-skills.component'; 




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
      {
        path: 'user-navbar',
        component: UserNavbarComponent,
       
      },
      {
        path: 'user-menubar',
        component: UserMenubarComponent,
       
      },
      {
        path: 'user-details',
        component: UserDetailsComponent,
       
      },
      {
        path: 'user-profile-complete',
        component: UserProfileCompleteComponent,
       
      },
      {
        path: 'user-soft-skill',
        component: UserSoftSkillsComponent,
       
      },
      {
        path: 'user-about',
        component: UserAboutComponent,
       
      },
      {
        path: 'user-skills',
        component: UserAboutComponent,
       
      },
      
      
      
      
      
      
      
    ]
  }  
]

@NgModule({
  declarations: [
   CandidateDashboardComponent,
  CandidateComponent,
  UserNavbarComponent,
  UserMenubarComponent,
  UserDetailsComponent,
  UserProfileCompleteComponent,
  UserSoftSkillsComponent,
  UserAboutComponent,
  UserSkillsComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CandidateModule { }
