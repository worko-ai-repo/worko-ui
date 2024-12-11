import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailDomainDenyListValidator(): ValidatorFn {
  const denyList = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'aol.com',
    'live.com',
    'mail.com',
    'protonmail.com',
    'yandex.com',
    // Add more personal email domains you want to block
  ];

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const email = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);

    // Check if the domain is in the deny list
    if (denyList.includes(domain)) {
      return { personalEmail: { value: control.value } }; // Email domain is in the deny list
    }

    return null; // Valid email
  };
}