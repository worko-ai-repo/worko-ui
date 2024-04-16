import { Component, EventEmitter, Output, Input, OnInit, OnChanges } from '@angular/core';
@Component({
  selector: 'app-awaiting-status',
  templateUrl: './awaiting-status.component.html',
  styleUrls: ['./awaiting-status.component.scss']
})
export class AwaitingStatusComponent implements OnChanges {

  @Input() userType:any;
  @Output() statusSelected = new EventEmitter<string>();
  @Input() referralList:any;
  @Output() showReferralDetails = new EventEmitter<string>();

  selectedStatus: string = 'Awaiting';
  selectedReferralSK:any;

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    return parts?.length > 2 ? parts[2] : '';
  }

  checkValue(value:any)
  {
    this.referralList = value;   
  }

  ngOnInit(): void {
    console.log(this.referralList)
  }

  onSelectStatus(status: string): void {
    this.selectedStatus = status;
    this.statusSelected.emit(status);
   
  }

  ngOnChanges(): void {
    console.log(this.referralList);
    if(this.referralList?.length>0)
    {
      this.selectedReferralSK = this.referralList[0].SK;
      this.showReferralDetails.emit(this.referralList[0]);
    }
    // this.showReferralDetails.emit(this.referralList?.length>0?this.referralList[0]:'');
  }

  showReferralData(item: any) {
    this.selectedReferralSK = item.SK;
    console.log(item);
    this.showReferralDetails.emit(item);
  }

}
