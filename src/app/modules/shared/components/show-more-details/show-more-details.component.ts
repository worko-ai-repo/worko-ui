import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-show-more-details',
  templateUrl: './show-more-details.component.html',
  styleUrls: ['./show-more-details.component.scss']
})
export class ShowMoreDetailsComponent {
  @Input() title: string = '';
  @Input() details: string = '';
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  cancelBtn() {
    this.onCancel.emit();
  }

}
