import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-public-reviews',
  templateUrl: './public-reviews.component.html',
  styleUrls: ['./public-reviews.component.scss'],
 
})
export class PublicReviewsComponent  {
  publicReviews:any[] = [
    {pName:'Rohit'},
    {pName:'Sam'},
    {pName:'John'},
    {pName:'Rohit'},
    {pName:'Sam'},
    {pName:'aniket'},
    

  ]

  

  constructor() { }

  
  currentPosition = 0;
  cardsPerPage = 3;

  get displayedReviews(): any[] {
    return this.publicReviews.slice(this.currentPosition, this.currentPosition + this.cardsPerPage);
  }

  moveRight() {
    if (this.currentPosition < this.publicReviews.length - this.cardsPerPage) {
      this.currentPosition++;
    }
  }

  moveLeft() {
    if (this.currentPosition > 0) {
      this.currentPosition--;
    }
  }
  
}
  

