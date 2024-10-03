import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { jobCategoryMatcher } from './modules/worko/matchers/custom-route-matcher';
import { JobCategoryComponent } from './modules/worko/components/job-category/job-category.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/worko/worko.module').then(m => m.WorkoModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'candidate',
    loadChildren: () => import('./modules/candidate/candidate.module').then(m => m.CandidateModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule)
  },
  // {
  //   path: 'company',
  //   loadChildren: () => import('./modules/mini-job-portal/mini-job-portal.module').then(m => m.MiniJobPortalModule)
  // },


  // {
  //   path: 'help',
  //   loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule)
  // },
  // {
  //   path: 'app-core',
  //   loadChildren: () => import('./modules/app-core/app-core.module').then(m => m.AppCoreModule)
  // },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
