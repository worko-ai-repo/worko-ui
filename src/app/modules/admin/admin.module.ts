import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
{
  path: '',
  redirectTo: '/admin/home',
  pathMatch: 'full'
},
{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'profile',
      component: ProfileComponent

    }
  ]
}

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
