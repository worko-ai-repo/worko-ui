import { Component, Input } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-referral-stepper',
  templateUrl: './referral-stepper.component.html',
  styleUrls: ['./referral-stepper.component.scss'],
  
})
export class ReferralStepperComponent {
  @Input() selectedReferral: any;

// statusitem:any[]=[]
  date:string='dec 2 2023';
  statusitem=[{name:'accepting',status:'completed'},
  {name:'accepted',status:'completed'},
  {name:'ongoing',status:'notcompleted'},
  {name:'done',status:'notcompleted'}];

  
  
  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });

  constructor() {}

  ngOnInit(): void {
    // console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    // console.log(this.selectedReferral, "selectedReferral");
  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }

  
}
