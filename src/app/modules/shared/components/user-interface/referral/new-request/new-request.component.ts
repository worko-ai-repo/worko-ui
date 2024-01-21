import { Component, EventEmitter, Output, Input,  } from '@angular/core';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent {
  @Input() selectedReferral: any;
   @Output() markAsDone = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  referralMarkAsDone(){
    this.markAsDone.emit(this.selectedReferral);
    // this.showReferralDetails.emit(item);
  }
}
