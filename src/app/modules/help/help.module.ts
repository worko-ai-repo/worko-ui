import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NghelpComponent } from './components/nghelp/nghelp.component';
import { HelpComponent } from './help.component';
import { WorkoComponent } from './components/worko/worko.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/help/worko',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HelpComponent,
    children: [
      {
        path: 'worko',
        component: WorkoComponent
      },
      {
        path: 'nghelp',
        component: NghelpComponent
  
      }
    ]
  }
  
  ]

@NgModule({
  declarations: [
    NghelpComponent,
    WorkoComponent,
    HelpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HelpModule { }
