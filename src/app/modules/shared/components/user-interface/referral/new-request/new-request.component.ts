import { Component, EventEmitter, Output, Input, } from '@angular/core';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent {
  @Input() selectedReferral: any;
  @Output() onWithdraw: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
   
  }

  receiveDataFromChild(data: any) {
    this.onWithdraw.emit(data);
  }
}
