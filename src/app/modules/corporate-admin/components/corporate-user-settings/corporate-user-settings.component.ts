import { Component, OnInit } from '@angular/core';
import { CorporateService } from '../../services/corporate.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
      newPassword: [
        '',
        [
          /** 
          * Password Policy: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
          * @see {AmazonCognito>Userpools>worko>Authentication_methods} at AWS Console
          */
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: this.passwordMatchValidator(), // Correctly bind the validator to the form group
    });
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

  /**
   * Custom Validator for Password Match
   */
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('newPassword')?.value; // Ensure it uses the passed form group
      const retypePassword = formGroup.get('confirmPassword')?.value;
  
      return password && retypePassword && password !== retypePassword
        ? { mismatch: true }
        : null;
    };
  }


  // Validation function for common and specific checks
  isInvalid(controlName: string): boolean {

    
    let control = this.passwordForm.get(controlName);
  
    if (!control) {
      return false;
    }
  
    const isInvalid = control.invalid && (control.dirty || control.touched);
  
    return isInvalid;
 }

 getErrorMessage(controlName: string): string | null {
  let control;
      control = this.passwordForm.get(controlName);
   // Check if the control is invalid and touched/dirty
   if (this.isInvalid(controlName)) {
     // Check and return specific validation error messages
     if (control?.errors) {
       if (control.errors["required"]) {
         return "This field is required";
       }
       if (control.errors["pattern"]) {
         return "Invalid format";
       }
       if (control.errors["minlength"]) {
         return `Minimum length is ${control.errors["minlength"].requiredLength} characters`;
       }
       // Check for the Password Match
        if (control.errors["mismatch"]) {
          return "Passwords do not match";
        }
     }
   }

   return null;
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
