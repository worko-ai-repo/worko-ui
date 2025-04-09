import { Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-resume-screener-form',
  templateUrl: './resume-screener-form.component.html',
  styleUrls: ['./resume-screener-form.component.scss']
})
export class ResumeScreenerFormComponent {

  @Input() fieldsDisabled: boolean = false; // Initially disable fields
  @Input() userType: 'CORPORATE' | 'ADMIN' = 'ADMIN'; // default
  @Input() jobTitleInput: string = '';
  @Input() experienceMinInput: number | null = null;
  @Input() experienceMaxInput: number | null = null;
  @Input() mustHavesInput: string[] = [];
  @Input() goodToHavesInput: string[] = [];
  @Input() mustNotHavesInput: string[] = [];

  screenerForm!: FormGroup;
  skillsTooltipMessage = "Type a skill and press Enter to add it to the list.";

  ngOnChanges(changes: SimpleChanges): void {
    if (this.screenerForm && (
      changes['jobTitleInput'] ||
      changes['experienceMinInput'] ||
      changes['experienceMaxInput'] ||
      changes['mustHavesInput'] ||
      changes['goodToHavesInput'] ||
      changes['mustNotHavesInput']
    )) {
      this.patchForm();
    }
  }


  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.screenerForm = this.fb.group({
      mustHaves: this.fb.array([]),
      goodToHaves: this.fb.array([]),
      mustNotHaves: this.fb.array([]),
    });

    if (this.userType === 'CORPORATE') {
      this.screenerForm.addControl('jobTitle', this.fb.control('', [
        Validators.required,
        Validators.maxLength(100)
      ]));

      this.screenerForm.addControl('experienceMin', this.fb.control(null, [Validators.required, Validators.min(0)]));
      this.screenerForm.addControl('experienceMax', this.fb.control(null, [Validators.required, Validators.min(0)]));

      this.screenerForm.setValidators(this.experienceRangeValidator());
    }

  }

  // Custom validator for experience range
  private experienceRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const min = group.get('experienceMin')?.value;
      const max = group.get('experienceMax')?.value;

      if (min == null || max == null) {
        return { experienceRequired: true };
      }

      if (min < 0 || max < 0) {
        return { negativeExperience: true };
      }

      if (min === max) {
        return { experienceEqual: true };
      }

      if (min > max) {
        return { invalidRange: true };
      }

      return null;
    };
  }

  patchForm(): void {
    this.screenerForm.patchValue({
      jobTitle: this.jobTitleInput,
      experienceMin: this.experienceMinInput,
      experienceMax: this.experienceMaxInput
    });

    this.setFormArray('mustHaves', this.mustHavesInput);
    this.setFormArray('goodToHaves', this.goodToHavesInput);
    this.setFormArray('mustNotHaves', this.mustNotHavesInput);
  }


  private setFormArray(controlName: string, values: string[]) {
    const formArray = this.screenerForm.get(controlName) as FormArray;
    formArray.clear();
    values.forEach(value => {
      formArray.push(this.fb.control(value));
    });
  }

  showExperienceError(type: 'min' | 'max'): any {
    const min = this.screenerForm.get('experienceMin');
    const max = this.screenerForm.get('experienceMax');
    const formErrors = this.screenerForm.errors;

    const control = type === 'min' ? min : max;

    return control?.touched && (
      control?.invalid ||
      !!formErrors?.['experienceEqual'] ||
      !!formErrors?.['experienceRequired'] ||
      !!formErrors?.['invalidRange']
    );
  }

  get experienceErrorMessage(): string | null {
    const min = this.screenerForm.get('experienceMin');
    const max = this.screenerForm.get('experienceMax');
    const formErrors = this.screenerForm.errors;

    if ((min?.touched || max?.touched)) {
      if (min?.errors?.['required'] || max?.errors?.['required'] || formErrors?.['experienceRequired']) {
        return 'Both min and max experience are required.';
      }
      if (min?.errors?.['min'] || max?.errors?.['min']) {
        return 'Experience cannot be negative.';
      }
      if (formErrors?.['experienceEqual']) {
        return 'Min and max experience cannot be the same.';
      }
      if (formErrors?.['invalidRange']) {
        return 'Max experience should be greater than min.';
      }
    }

    return null;
  }



  get jobTitle() {
    return this.screenerForm.get('jobTitle');
  }

  get mustHaves(): FormArray {
    return this.screenerForm.get('mustHaves') as FormArray;
  }

  get goodToHaves(): FormArray {
    return this.screenerForm.get('goodToHaves') as FormArray;
  }

  get mustNotHaves(): FormArray {
    return this.screenerForm.get('mustNotHaves') as FormArray;
  }

  get experienceMin() {
    return this.screenerForm.get('experienceMin');
  }

  get experienceMax() {
    return this.screenerForm.get('experienceMax');
  }

  addSkill(event: any, field: 'mustHaves' | 'goodToHaves' | 'mustNotHaves'): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (event.key === 'Enter' && value) {
      if (field === 'mustHaves' && !this.mustHaves.value.includes(value)) {
        this.mustHaves.push(this.fb.control(value));
      } else if (field === 'goodToHaves' && !this.goodToHaves.value.includes(value)) {
        this.goodToHaves.push(this.fb.control(value));
      }
      else if (field === 'mustNotHaves' && !this.mustNotHaves.value.includes(value)) {
        this.mustNotHaves.push(this.fb.control(value));
      }
      input.value = '';
      event.preventDefault(); // Prevent form submission
    }
  }

  removeSkill(index: number, field: 'mustHaves' | 'goodToHaves' | 'mustNotHaves'): void {
    if (field === 'mustHaves') {
      this.mustHaves.removeAt(index);
    } else if (field === 'goodToHaves') {
      this.goodToHaves.removeAt(index);
    }
    else if (field === 'mustNotHaves') {
      this.mustNotHaves.removeAt(index);
    }
  }

  isFormValid(): boolean {
    return this.screenerForm.valid;
  }

  getScreenerFormData(): {
    jobTitle?: string;
    experienceMin?: number;
    experienceMax?: number;
    mustHaveSkills: string[];
    goodToHaveSkills: string[];
    mustNotHaveSkills: string[];
  } {
    return {
      jobTitle: this.screenerForm.get('jobTitle')?.value,
      experienceMin: this.screenerForm.get('experienceMin')?.value,
      experienceMax: this.screenerForm.get('experienceMax')?.value,
      mustHaveSkills: this.mustHaves.value,
      goodToHaveSkills: this.goodToHaves.value,
      mustNotHaveSkills: this.mustNotHaves.value,
    };
  }


}
