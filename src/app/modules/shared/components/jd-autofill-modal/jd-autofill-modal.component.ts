import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-jd-autofill-modal",
  templateUrl: "./jd-autofill-modal.component.html",
  styleUrls: ["./jd-autofill-modal.component.scss"],
})
export class JdAutofillModalComponent implements OnInit {
  @Output() onSkip: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAutofillPastJd: EventEmitter<any> = new EventEmitter<any>();

  // Variables
  isJobDescInValid: boolean = true;
  isJobDescTouched: boolean = false; // Track user interaction
  jdValidFormatInfo =
    "Please enter a valid job description. A valid job description should contain at least 5 of the following keywords: experience, education, skills, certifications, Preferred Skills, job description, responsibilities, role, Employment, Department";
  jdText: string = "";

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    // Disable textarea autofill and remove initial focus
    setTimeout(() => {
      const textArea = document.getElementById(
        "job-description"
      ) as HTMLTextAreaElement;
      textArea.autocomplete = "off";
      textArea.blur(); // Remove focus from the textarea
    }, 1000);
  }

  jobDescriptionValidator(event: any): void {
    const text = event.target.value || "";
    this.jdText = text; // Update jdText with the current input
    const keywords = [
      "experience",
      "education",
      "skills",
      "certifications",
      "Preferred Skills",
      "job description",
      "responsibilities",
      "role",
      "Employment",
      "Department",
    ];

    // Count the number of keywords found in the text
    const containsKeywords = this.countKeywords(text, keywords) >= 5;

    // Update invalid state only if touched
    this.isJobDescInValid = !containsKeywords;
    this.isJobDescTouched = true;
  }

  countKeywords(text: string, keywords: string[]): number {
    const regex = new RegExp(keywords.join("|"), "ig");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  skipAutofill() {
    this.onSkip.emit();
  }

  closeModal() {
    this.jdText = "";
    // Explicitly clear the textarea value in case it is not bound
    const textArea = document.getElementById(
      "job-description"
    ) as HTMLTextAreaElement;
    if (textArea) {
      textArea.value = "";
    }
    this.onClose.emit();
    this.isJobDescTouched = false; // Reset touched state
  }

  fetchLamdaJobDetails() {
    if (!this.isJobDescInValid) {
      // Pass the job description as the event payload
      this.onAutofillPastJd.emit(this.jdText);
    } else {
      console.error("Job description is invalid. Cannot proceed.");
    }
  }

  onTouchStart() {
    this.isJobDescTouched = true; // Mark the field as touched
  }
}
