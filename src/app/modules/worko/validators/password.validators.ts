import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    // Define your password requirements
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const hasNumber = /\d/.test(value);

    // Check if the password meets all requirements
    const isValid = hasLowercase && hasUppercase && hasSymbol && hasNumber;

    return isValid ? null : { passwordRequirements: true };
  };
}
