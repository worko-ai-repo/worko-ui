import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const min = control.get('min')?.value;
    const max = control.get('max')?.value;

    // If min or max is null, no validation needed
    if (min == null || max == null) {
      return null;
    }

    // Check if min is greater than max
    return min > max ? { minGreaterThanMax: true } : null;
  };
}
