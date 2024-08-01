import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrls: ['./circle-chart.component.scss'],
})
export class CircleChartComponent implements OnInit {
  @Input() isEmployeeReferralPage:any;
  @Input() circleDiameter:number=105;
  private _chartText: string = '';
  selectedColor: string = "#D9D9D9";
  // Initialize the circle color
  circleColor: string = '#D9D9D9';


  @Input() get chartText() {
    return this._chartText;
  }
  set chartText(value: string) {
    this._chartText = value;
  }

  getColor(): string {
    // Convert chartText to a number
    const chartValueAsNumber: number = parseFloat(this.chartText);
  
    // Check if the conversion is successful and if the value is less than 70
    return !isNaN(chartValueAsNumber) && chartValueAsNumber < 70 ? 'red' : 'green';
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

  getFontSize(value: number): string {
    return value % 1 !== 0 ? '26px' : '30px'; //font size is dynamically set to 26px if chartValue is a decimal and 30px if it is an integer.
  }
}
