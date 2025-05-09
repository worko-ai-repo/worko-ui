import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-referral-rating-popup",
  templateUrl: "./referral-rating-popup.component.html",
  styleUrls: ["./referral-rating-popup.component.scss"],
})
export class ReferralRatingPopupComponent implements OnChanges {
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType: any;

  ratingControl = new FormControl(null, Validators.required);
  reviewControl = new FormControl("");
  isSubmitDisabled = true; // Initially disable the submit button

  getRating() {
    
  }

  ngOnChanges() {}

  submitReviewRating() {
    if (this.ratingControl.valid) {
      const reviewRatingData = {
        rating: this.ratingControl.value,
        review: this.reviewControl.value ?? "",
      };

      this.ratingControl.reset();
      this.reviewControl.reset();
      this.onSuccess.emit(reviewRatingData);
    }
  }

  cancelBtn() {
    this.onCancel.emit();
  }
}
