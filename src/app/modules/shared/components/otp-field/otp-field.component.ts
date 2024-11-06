import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-otp-field',
  templateUrl: './otp-field.component.html',
  styleUrls: ['./otp-field.component.scss']
})
export class OtpFieldComponent {

  @Input() otpForm!: FormGroup;
  @Input() otpControls: FormControl[] = [];
  @Input() isResendDisabled!: boolean;

  @Output() resendOtp = new EventEmitter<void>();
  @Output() confirmSignUp = new EventEmitter<void>();

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>; // Reference to individual OTP inputs
  formSubmitted!: boolean;

  constructor(private cdr:ChangeDetectorRef){
    
  }

  ngAfterViewInit() {
    this.cdr.detectChanges(); // Manually triggering change detection
    if (this.otpInputs.length) {
      this.focusOtpInput(0); // Setting initial focus on the first input
    }
  }
  

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;

    // Only allow numeric input
    if (!/^\d$/.test(input.value)) {
      input.value = '';  // Clear the non-numeric value
      return;
    }

    // Move focus to the next input if a digit is entered
    if (input.value.length === 1 && index < this.otpControls.length - 1) {
      setTimeout(() => this.focusOtpInput(index + 1), 0);
    }

    // Check if OTP is complete
    if (this.otpForm.valid && this.otpValuesFilled()) {
      this.formSubmitted = true;
      this.confirmSignUp.emit();
    }
  }

  // Handle OTP backspace navigation
  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && target.value === '' && index > 0) {
      // this.focusOtpInput(index - 1);
      setTimeout(() => this.focusOtpInput(index - 1), 0);

    }
  }

  // Focus an OTP input based on its index
  private focusOtpInput(index: number): void {
    // console.log("controls are", this.otpControls);
    const otpInput = this.otpInputs.toArray()[index];
    if (otpInput) {
      otpInput.nativeElement.focus();
    }
  }

  // Check if OTP is fully valid
  isOtpInvalid(): boolean {
    const isAnyTouched = this.otpControls.some(control => control.touched);
    const isOtpComplete = this.otpForm.valid && this.otpValuesFilled();
    return isAnyTouched && !isOtpComplete;
  }

  otpValuesFilled(): boolean {
    return this.otpControls.every(control => control.value !== '');
  }

  onResendOtp() {
    this.resendOtp.emit();
    // Clear OTP values on resend
    this.otpControls.forEach(control => control.reset());
    this.focusOtpInput(0); // Refocus on the first input
  }

}
