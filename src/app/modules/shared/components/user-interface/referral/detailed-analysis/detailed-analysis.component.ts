import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detailed-analysis',
  templateUrl: './detailed-analysis.component.html',
  styleUrls: ['./detailed-analysis.component.scss']
})
export class DetailedAnalysisComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() scoreDetails:any;

  cancelBtn() {
    this.onCancel.emit();
  }

}
