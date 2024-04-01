import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkoAuthComponent } from './components/worko-auth/worko-auth.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

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
  path: 'logout',
  component:WorkoAuthComponent,
  data: { action: 'logout' },} 

];

@NgModule({
  declarations: [
    WorkoAuthComponent,
    CreateUserComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
