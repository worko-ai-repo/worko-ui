import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent {

  @Input() jobDescription!: any;
  @Output() jdValidationChange = new EventEmitter<boolean>();
  @Output() jdTextChange = new EventEmitter<string>(); // Emits JD text to parent

  jdControl: FormControl;

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

  constructor() {
    // Initializing the reactive form control with validators and proper options
    this.jdControl = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(100),
        this.keywordValidator(), // Custom keyword validation
      ],
    });
  }

  ngOnInit(): void {
    // Subscribe to changes in the form control to handle real-time validation
    this.jdControl.valueChanges.subscribe((value) => {
      const isValid = this.jdControl.valid;
      this.jdValidationChange.emit(isValid); // Emitting validation status to the parent
      this.jdTextChange.emit(value); // Emitingt the current JD text to the parent
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobDescription'] && changes['jobDescription'].currentValue) {
      this.jdControl.setValue(changes['jobDescription'].currentValue);
      const isValid = this.jdControl.valid;
      this.jdValidationChange.emit(isValid); // Emitting validation status to the parent
    }
  }

  private keywordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
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

      const value = control.value || '';
      const matches = (value.match(new RegExp(keywords.join("|"), "ig")) || []).length;

      return matches >= 5 ? null : { keywordsMissing: true }; // Return null if valid; otherwise, return error object.
    };
  }

  // Get error message for the field
  getErrorMessage(): string {
    if (this.jdControl.hasError('required')) {
      return 'Job Description is required.';
    } else if (this.jdControl.hasError('minlength')) {
      return 'Job Description must be at least 100 characters long.';
    } else if (this.jdControl.hasError('keywordsMissing')) {
      return 'Please include at least 5 relevant keywords.';
    }
    return '';
  }

}
