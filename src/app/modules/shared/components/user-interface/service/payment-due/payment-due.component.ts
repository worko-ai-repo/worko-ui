import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-due',
  templateUrl: './payment-due.component.html',
  styleUrls: ['./payment-due.component.scss']
})
export class PaymentDueComponent {
  @Input() selectedService: any;
}
