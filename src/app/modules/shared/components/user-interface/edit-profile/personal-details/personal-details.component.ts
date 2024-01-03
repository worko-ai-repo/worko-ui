import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent {

  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
}
