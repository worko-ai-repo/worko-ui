import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxValidator(limitOfMax:number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const min = control.get('min')?.value;
    const max = control.get('max')?.value;
    // If max value is greater than limitOfMax, return an error
    if(max > limitOfMax){
      return { maxGreaterThanLimit: true };
    }
    // If min or max is null, no validation needed
    if (min == null || max == null) {
      return { minAndMaxRequired: true };
    }
/*     if(min === max){
      return { minAndMaxEqual: true};
    }  */
    // If min is greater than max, return an error
    return min > max ? { minGreaterThanMax: true } : null;
  };
}
