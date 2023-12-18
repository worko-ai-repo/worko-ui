import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-subscription-pack',
  templateUrl: './subscription-pack.component.html',
  styleUrls: ['./subscription-pack.component.scss']
})
export class SubscriptionPackComponent {
  @Input() isOpen: boolean = false;
  @Input() package: any;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() onError: EventEmitter<void> = new EventEmitter<void>();
  

  constructor(){}

  makeOrder(item: any){
    // const data = 'Hello from child component!';
    this.onSuccess.emit();
    // this.onError.emit();
  }
}
