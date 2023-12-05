import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-subscription-pack',
  templateUrl: './subscription-pack.component.html',
  styleUrls: ['./subscription-pack.component.scss']
})
export class SubscriptionPackComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
 
  

  

  constructor(){}
}
