import { Component } from '@angular/core';

@Component({
  selector: 'app-public-reviews',
  templateUrl: './public-reviews.component.html',
  styleUrls: ['./public-reviews.component.scss']
})
export class PublicReviewsComponent {
  publicReviews:any[] = [
    {pName:'Rohit'},
    {pName:'Sam'},
    {pName:'John'},

  ]
  
}
