import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-description',
  templateUrl: './mini-job-portal-description.component.html',
  styleUrls: ['./mini-job-portal-description.component.scss']
})
export class MiniJobPortalDescriptionComponent {

  @Output() requestReferral = new EventEmitter<void>();

  constructor(){}

  onRequestReferral() {
    this.requestReferral.emit();
  }

}
