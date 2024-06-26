import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-withdrawn-referral',
  templateUrl: './withdrawn-referral.component.html',
  styleUrls: ['./withdrawn-referral.component.scss']
})
export class WithdrawnReferralComponent {

  @Input() selectedReferral: any;
  @Output() onWithdraw: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
   
  }

  ngOnChanges(): void {
  
    // this.selectedReferral = "test"
  }

  receiveDataFromChild(data: any) {
    this.onWithdraw.emit(data);
  }
}
