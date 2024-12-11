import { Component, OnInit } from '@angular/core';
import { CorporateService } from '../../services/corporate.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorporateVitalDetails } from '../../corporate.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';

@Component({
  selector: 'app-corporate-user-settings',
  templateUrl: './corporate-user-settings.component.html',
  styleUrls: ['./corporate-user-settings.component.scss']
})
export class CorporateUserSettingsComponent implements OnInit {
  corporateVitalDetails: CorporateVitalDetails = {};
  corporateCompanyName: string ="";
  isRecruiter: boolean = false;
  passwordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private corporateService: CorporateService,
    private fb: FormBuilder
   ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {

    // Set up the corporateVitalDetails
    this.corporateService.corporateDetails$.subscribe((details: any) => {
      if (details) {
        this.corporateVitalDetails = details;
        this.corporateCompanyName = this.corporateVitalDetails.companyName || "";
        
        this.corporateVitalDetails.corporateUserType === "RECRUITER" ? this.isRecruiter = true : this.isRecruiter = false;
      }
    });

    // Fetch jobs on component initialization
  }

  // Custom validator to check if newPassword matches confirmPassword
  private passwordMatchValidator(formGroup: FormGroup): { mismatch: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Submit handler for the form
  async onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    if (this.passwordForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      this.isSubmitting = false;
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    try {
      // Call your password change handler here
      const result = await this.cognitoService.handleChangePassword({ oldPassword, newPassword });

      if (result.error) {
        this.errorMessage = 'Failed to reset password. Please try again.';
      } else {
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
