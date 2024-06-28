import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog-popup',
  templateUrl: './confirmation-dialog-popup.component.html',
  styleUrls: ['./confirmation-dialog-popup.component.scss']
})
export class ConfirmationDialogPopupComponent implements OnChanges {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() action: any;

  ngOnChanges() {
   
  }

  actionBtn() {
    this.onSuccess.emit();
  }

  cancelBtn()
  {
    this.onCancel.emit();
  }

}
