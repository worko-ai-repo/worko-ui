import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkoAuthComponent } from './components/worko-auth/worko-auth.component';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   component: TranscriptsAuthComponent,
  //   pathMatch: 'full',
  //   data: { action: 'login' },
  // },
  {
    path: 'logout',
    component: WorkoAuthComponent,
    pathMatch: 'full',
    data: { action: 'logout' },
  },



];

@NgModule({
  declarations: [
    WorkoAuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
