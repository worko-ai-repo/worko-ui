import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  getReferral:boolean = false;
  giveReferral:boolean = true;

  ngOnInit(): void {
    setInterval(() => {
      this.swapValues();
    }, 8000);
  }

  swapValues() {
    const temp = this.getReferral;
    this.getReferral = this.giveReferral;
    this.giveReferral = temp;
  }

}
