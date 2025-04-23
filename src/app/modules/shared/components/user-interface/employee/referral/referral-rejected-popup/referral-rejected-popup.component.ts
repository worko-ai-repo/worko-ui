import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-referral-rejected-popup',
  templateUrl: './referral-rejected-popup.component.html',
  styleUrls: ['./referral-rejected-popup.component.scss']
})
export class ReferralRejectedPopupComponent implements OnInit {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType!: 'Employee' | 'Recruiter' | 'Admin';
  @Input() forceCommentRequiredAndVisible: boolean | undefined;
  rejectForm!: FormGroup;
  isCommentRequired!: boolean;

  constructor(private fb: FormBuilder) {
    this.rejectForm = this.fb.group({
      reason: ['', Validators.required], // Set default value to '' (empty string)
      comment: [''],
  });
  }

  ngOnInit(): void {
    const isOnlyCommentMode = this.forceCommentRequiredAndVisible === true;
    this.isCommentRequired = isOnlyCommentMode || this.userType === 'Employee';
    this.rejectForm = this.fb.group({
      reason: [isOnlyCommentMode ? null : '', isOnlyCommentMode ? [] : Validators.required],
      comment: ['', this.isCommentRequired ? Validators.required : []],
    });
  }

  reasonControl: FormControl = new FormControl('', Validators.required);
  comments: FormControl = new FormControl('', Validators.required);
  corporateComments:FormControl = new FormControl('');

  ngOnChanges() {
  }

  onSubmit() {
    if (this.rejectForm.valid) {
      const { reason, comment } = this.rejectForm.value;
      this.onSuccess.emit({
        rejectTitle: reason || '',
        rejectComments: comment || '', // Optional comment for Corporate
      });
      this.rejectForm.reset();
    }
  }

  // rejectSubmitBtn() {
  //   if (this.reasonControl.valid && this.comments.valid) {
  //     const rejectReasons = {
  //       rejectTitle: this.reasonControl.value,
  //       rejectComments: this.comments.value
  //     };
     
  //     this.reasonControl.setValue('');
  //     this.comments.reset();
  //     this.onSuccess.emit(rejectReasons);
  //   }
  // }

}
