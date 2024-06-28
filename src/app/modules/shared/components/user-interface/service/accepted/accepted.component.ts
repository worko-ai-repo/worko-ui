import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accepted',
  templateUrl: './accepted.component.html',
  styleUrls: ['./accepted.component.scss']
})
export class AcceptedComponent {
  @Input() selectedService: any;
  @Output() markAsDone = new EventEmitter<string>();


  ngOnChanges(): void {
  }

  serviceMarkAsDone(){
    this.markAsDone.emit(this.selectedService);
    // this.showReferralDetails.emit(item);
  }
}
