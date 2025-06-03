import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewDetailsService {
  THRESHOLD_SCORE = 70;

  getScoreDetails(data: any): any {
    if (!data) {
      console.error("Invalid input: data is null or undefined");
      return null;
    }

    return data.matchingScore >= this.THRESHOLD_SCORE
      ? data.scoreDetails
      : data.rejectionFeedbackBySystem;
  }

  constructor() { }
}
