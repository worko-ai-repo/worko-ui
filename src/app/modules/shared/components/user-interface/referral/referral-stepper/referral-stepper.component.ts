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
  date:string='Dec 2 2023';
  statusitem=[{name:'Awaiting',status:'completed'},
  {name:'Accepted',status:'completed'},
  {name:'OnGoing',status:'completed'},
  {name:'Done',status:'notcompleted'}];

  
  
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
    console.log(this.selectedReferral);
  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }

  
}
