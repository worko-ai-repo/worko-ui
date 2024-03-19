import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-review-popup',
  templateUrl: './review-popup.component.html',
  styleUrls: ['./review-popup.component.scss']
})
export class ReviewPopupComponent implements OnChanges {

  @Input() userType:any;

  ratingControl = new FormControl(0);

  getRating() {
    console.log(this.ratingControl.value);
  }

  ngOnChanges() {
    console.log(this.userType);
  }
  
}
