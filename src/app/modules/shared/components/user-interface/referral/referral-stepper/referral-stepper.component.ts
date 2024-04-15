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
  date: string = 'Dec 2 2023';
  @Input() statusitem = [{ name: 'Awaiting', status: '', date: '' },
  { name: 'Accepted', status: '', date: '' },
  { name: 'OnGoing', status: '', date: '' },
  { name: 'Done', status: '', date: '' }];


  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });

  constructor() { }

  ngOnInit(): void {
    // console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    this.statusIndicator();
  }

  statusIndicator() {
    console.log(this.selectedReferral);
    let index = this.statusitem.findIndex((elem) => elem?.name?.toUpperCase() === this.selectedReferral?.status?.toUpperCase());
    if(this.selectedReferral?.status?.toUpperCase() === "ACCEPTED") {
      index++;
    }
    this.statusitem.forEach((element, i) => {
      if (i <= index) {
        element.status = 'completed';
        this.dateAssignment(element);
      }
    });
  }

  dateAssignment(element:any) {

    if (element?.name?.toUpperCase() === 'AWAITING') {
      element.date = this.selectedReferral?.createdAt;
    }
    if (element?.name?.toUpperCase() === 'ACCEPTED') {
      element.date = this.selectedReferral?.acceptedAtByUser;
    }
    if (element?.name?.toUpperCase() === 'CANCELLED') {
      element.date = this.selectedReferral?.cancelledDate;
    }
    if (element?.name?.toUpperCase() === 'REJECTED') {
      element.date = this.selectedReferral?.rejectedDate;
    }
    if (element?.name?.toUpperCase() === 'DONE') {
      element.date = this.selectedReferral?.doneByEmployee;
    }
    if (element?.name?.toUpperCase() === 'WITHDRAWN') {
      element.date = this.selectedReferral?.withdrawnByUser?.actionDate;
    }

  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }


}
