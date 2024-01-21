import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-awaiting-service',
  templateUrl: './awaiting-service.component.html',
  styleUrls: ['./awaiting-service.component.scss']
})
export class AwaitingServiceComponent {
  @Input() selectedService: any;
  @Output() markAsDone = new EventEmitter<string>();


  ngOnChanges(): void {
    console.log(this.selectedService, "selectedService");
  }

  serviceMarkAsDone(){
    this.markAsDone.emit(this.selectedService);
    // this.showReferralDetails.emit(item);
  }
}
