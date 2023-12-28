import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { AwaitingStatusComponent } from './components/user-interface/referral/awaiting-status/awaiting-status.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
  ModalComponent
  ],
})
export class SharedModule { }
