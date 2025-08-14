import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ViewDetailsService {
  THRESHOLD_SCORE = 50;

  getScoreDetails(data: any): any {
    if (!data) {
      console.error("Invalid input: data is null or undefined");
      return null;
    }
    const isSentToCorporate =  data?.displayToCorporate ?? false; // Default to false if undefined
    if (isSentToCorporate === false) {
      if(data.matchingScore >= 50 && data.matchingScore <= 70){
        return data.rejectionFeedbackBySystem 
      }else if(data.matchingScore >=90){
        return data.scoreDetails;
      }else{
        return data.rejectionFeedbackBySystem
      }
    } else {
      return data.scoreDetails;
    }
  }

  constructor() {}
}
