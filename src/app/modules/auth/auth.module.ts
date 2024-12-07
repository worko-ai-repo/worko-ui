import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkoAuthComponent } from './components/worko-auth/worko-auth.component';
import { CreateEmployeeForLinkedinComponent } from './components/create-employee-for-linkedin/create-employee-for-linkedin.component';
import { CreateCandidateForLinkedinComponent } from './components/create-candidate-for-linkedin/create-candidate-for-linkedin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from "../shared/shared.module";
import { CreateUserForCorporateComponent } from './components/create-user-for-corporate/create-user-for-corporate.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginUserForCorporateComponent } from './components/login-user-for-corporate/login-user-for-corporate.component';


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
    data: { action: 'checkRedirection' },
  },
  {
    path: 'logout',
    component: WorkoAuthComponent,
    pathMatch: 'full',
    data: { action: 'logout' },
  },
  // {
  //   path: 'checkRedirection',
  //   component: WorkoAuthComponent,
  //   pathMatch: 'full',
   
  // },
 
  {
    path: 'candidatecompleteSignUp',
    component: CreateCandidateForLinkedinComponent,
   
  },
  {
    path: 'employeecompleteSignUp',
    component: CreateEmployeeForLinkedinComponent, 
  },

  // Corporate section for signup
  {
    path: 'corporate/signup/:inviteId',
    component: CreateUserForCorporateComponent, 
  },
  // Corporate section for login
  {
    path: 'corporate/login',
    component: LoginUserForCorporateComponent, 
  }

//  {
//   path: 'logout',
//   component:WorkoAuthComponent,
//   data: { action: 'logout' },} 

];

@NgModule({
    declarations: [
        WorkoAuthComponent,
        CreateEmployeeForLinkedinComponent,
        CreateCandidateForLinkedinComponent,
        CreateUserForCorporateComponent,
        LoginUserForCorporateComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class AuthModule { }
