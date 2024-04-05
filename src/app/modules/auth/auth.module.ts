import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkoAuthComponent } from './components/worko-auth/worko-auth.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateEmployeeForLinkedinComponent } from './components/create-employee-for-linkedin/create-employee-for-linkedin.component';
import { CreateCandidateForLinkedinComponent } from './components/create-candidate-for-linkedin/create-candidate-for-linkedin.component';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   component: transcriptsauthcomponent,
  //   pathmatch: 'full',
  //   data: { action: 'login' },
  // },
  {
    path: 'checkRedirection',
    component: WorkoAuthComponent,
    pathMatch: 'full',
   
  },
  {
    path: 'fetch-data',
    component: CreateUserComponent,
   
  },
 
  {
    path: 'candidatecompleteSignUp',
    component: CreateCandidateForLinkedinComponent,
   
  },
  {
    path: 'employeecompleteSignUp',
    component: CreateEmployeeForLinkedinComponent,
   
  },

 {
  path: 'logout',
  component:WorkoAuthComponent,
  data: { action: 'logout' },} 

];

@NgModule({
  declarations: [
    WorkoAuthComponent,
    CreateUserComponent,
    CreateEmployeeForLinkedinComponent,
    CreateCandidateForLinkedinComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
