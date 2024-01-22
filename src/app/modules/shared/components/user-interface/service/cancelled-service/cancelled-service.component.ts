import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cancelled-service',
  templateUrl: './cancelled-service.component.html',
  styleUrls: ['./cancelled-service.component.scss']
})
export class CancelledServiceComponent {
  @Input() selectedService: any;
}
