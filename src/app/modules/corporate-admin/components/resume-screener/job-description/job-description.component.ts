import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent {

  @Output() jdValidationChange = new EventEmitter<boolean>();
  @Output() jdTextChange = new EventEmitter<string>(); // Emits JD text to parent

  // Variables
  isJobDescInValid: boolean = true;
  isJobDescTouched: boolean = false; // Track user interaction

  jdValidFormatInfo = `
  A valid job description must include at least 5 of these keywords:
  1. Experience
  2. Education
  3. Skills
  4. Certifications
  5. Preferred Skills
  6. Job Description
  7. Responsibilities
  8. Role
  9. Employment
  10. Department
`;
  jdText: string = "";

  constructor() { }

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

    // Emit the validation result and JD text to the parent
    this.jdValidationChange.emit(containsKeywords);
    this.jdTextChange.emit(this.jdText);
  }

  onTouchStart() {
    this.isJobDescTouched = true; // Mark the field as touched
  }

  countKeywords(text: string, keywords: string[]): number {
    const regex = new RegExp(keywords.join("|"), "ig");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

}
