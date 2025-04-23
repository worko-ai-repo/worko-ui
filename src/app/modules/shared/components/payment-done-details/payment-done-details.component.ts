import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-payment-done-details',
  templateUrl: './payment-done-details.component.html',
  styleUrls: ['./payment-done-details.component.scss']
})
export class PaymentDoneDetailsComponent {

  @Output() paymentFormSubmitted = new EventEmitter<{
    actionDate: string;
    amountPaid: number;
    uniqueTransactionReference: string;
  }>();

  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      actionDate: ['', Validators.required],
      amountPaid: ['', [Validators.required, Validators.min(1)]],
      uniqueTransactionReference: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.paymentForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.paymentForm.get(controlName);

    if (control?.hasError('required')) return 'This field is required';
    if (controlName === 'amountPaid' && control?.hasError('min')) return 'Amount must be greater than 0';

    return 'Invalid input';
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.paymentFormSubmitted.emit(this.paymentForm.value);
      this.paymentForm.reset();
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

}
