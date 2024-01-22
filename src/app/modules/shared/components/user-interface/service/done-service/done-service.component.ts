import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-done-service',
  templateUrl: './done-service.component.html',
  styleUrls: ['./done-service.component.scss']
})
export class DoneServiceComponent {
  @Input() selectedService: any;
}
