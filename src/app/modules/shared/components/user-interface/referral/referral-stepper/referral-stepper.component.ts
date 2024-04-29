import { Component, Input } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-referral-stepper',
  templateUrl: './referral-stepper.component.html',
  styleUrls: ['./referral-stepper.component.scss'],

})
export class ReferralStepperComponent {
  @Input() selectedReferral: any;
  // rejectedReasons: any;


  // statusitem:any[]=[]
  date: string = 'Dec 2 2023';
  @Input() statusitem = [{ name: 'Awaiting', status: '', date: '' },
  { name: 'Accepted', status: '', date: '' },
  { name: 'OnGoing', status: '', date: '' },
  { name: 'Done', status: '', date: '' }];
  userId: any;


  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
    // console.log(this.selectedReferral, "selectedReferral");
    this.userId = this.storage.get("userId");
  }

  ngOnChanges(): void {
    console.log(this.statusitem);
    this.statusIndicator();
  }

  statusIndicator() {
    // this.statusitem = [];
    this.statusitem.forEach((element:any) => {
      element.status = '';
      element.date = ''; 
    });
    let index = 0;
    if (this.statusitem?.length > 0 && this.statusitem[1]?.name?.toUpperCase() === "REJECTED") {
      // this.selectedReferral.rejectedByUserIds.forEach((elem: any) => {
      //   if (this.userId === elem.userId) {
      //     this.rejectedReasons = {
      //       reason: elem?.reason,
      //       comment: elem?.userComment
      //     }
      //   }
      // });
      index = this.statusitem.length;
    }
    else {
      index = this.statusitem.findIndex((elem) => elem?.name?.toUpperCase() === this.selectedReferral?.status?.toUpperCase());
    }

    if (this.selectedReferral?.status?.toUpperCase() === "ACCEPTED") {
      index++;
    }
    this.statusitem.forEach((element, i) => {

      if (i <= index) {
        element.status = 'completed';
        this.dateAssignment(element);
      }
    });
  }

  dateAssignment(element: any) {

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
      this.selectedReferral.rejectedByUserIds.forEach((elemt: any) => {
        if (this.userId === elemt.userId) {
          element.date = elemt.actionDate;
        }
      });
    }
    if (element?.name?.toUpperCase() === 'DONE') {
      element.date = this.selectedReferral?.doneByEmployee ?? this.selectedReferral?.doneByCandidate;
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
