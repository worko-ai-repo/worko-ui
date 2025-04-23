import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-details-form',
  templateUrl: './bank-details-form.component.html',
  styleUrls: ['./bank-details-form.component.scss']
})
export class BankDetailsFormComponent {

  @Output() withdrawalFormSubmitted = new EventEmitter<{
    accountHolderName: string;
    accountNumber: number;
    ifscCode: string;
    branchName: string;
  }>();

  bankForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bankForm = this.fb.group({
      accountHolderName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/)
      ]],
      accountNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{9,18}$/)
      ]],
      confirmAccountNumber: ['', Validators.required],
      ifscCode: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      ]],
      branchName: ['', [
        Validators.required,
        Validators.pattern(/^[\w\s]+$/)
      ]]
    }, { validators: this.accountMatchValidator });
  }

  accountMatchValidator(group: AbstractControl): ValidationErrors | null {
    const accNo = group.get('accountNumber')?.value;
    const confirmAccNo = group.get('confirmAccountNumber')?.value;
    return accNo === confirmAccNo ? null : { accountMismatch: true };
  }

  isInvalid(controlName: string): boolean {
    const control = this.bankForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getControl(controlName: string): AbstractControl | null {
    return this.bankForm.get(controlName);
  }

  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);

    if (control?.hasError('required')) return 'This field is required';

    switch (controlName) {
      case 'accountHolderName':
        if (control?.hasError('pattern')) return 'Only letters and spaces allowed';
        break;
      case 'accountNumber':
        if (control?.hasError('pattern')) return 'Must be 9–18 digits';
        break;
      case 'confirmAccountNumber':
        if (this.bankForm.hasError('accountMismatch')) return 'Account numbers do not match';
        break;
      case 'ifscCode':
        if (control?.hasError('pattern')) return 'Invalid IFSC code format';
        break;
      case 'branchName':
        if (control?.hasError('pattern')) return 'Only letters, numbers and spaces allowed';
        break;
    }

    return 'Invalid input';
  }

  onSubmit() {
    if (this.bankForm.valid) {
      const { accountHolderName, accountNumber, ifscCode, branchName } = this.bankForm.value;
      this.withdrawalFormSubmitted.emit({ accountHolderName, accountNumber, ifscCode, branchName });
      this.bankForm.reset();
    } else {
      this.bankForm.markAllAsTouched();
    }
  }

}
