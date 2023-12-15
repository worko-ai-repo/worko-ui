import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrls: ['./circle-chart.component.css'],
})
export class CircleChartComponent implements OnInit {
  private _chartText: string = '';
  
  @Input() get chartText() {
    return this._chartText;
  }
  set chartText(value: string) {
    this._chartText = value;
  }

  private _chartValue: number = 0;
  @Input() get chartValue() {
    return this._chartValue;
  }
  set chartValue(value: number) {
    this._chartValue = value;
  }

  hideProgressBar: boolean = false;

  ngOnInit() {
    this.hideProgressBar = this.chartValue ? false : true;
  }
}
