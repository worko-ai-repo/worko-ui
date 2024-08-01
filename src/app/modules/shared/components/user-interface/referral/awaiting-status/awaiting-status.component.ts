import { Component, EventEmitter, Output, Input, OnInit, OnChanges, HostListener } from '@angular/core';
@Component({
  selector: 'app-awaiting-status',
  templateUrl: './awaiting-status.component.html',
  styleUrls: ['./awaiting-status.component.scss']
})
export class AwaitingStatusComponent implements OnChanges {



  @Input() screenWidth: any;
  @Input() userType: any;
  @Output() statusSelected = new EventEmitter<string>();
  @Input() referralList: any;
  @Output() showReferralDetails = new EventEmitter<string>();

  selectedStatus: string = 'Awaiting';
  selectedReferralSK: any;
  isSmallScreen: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateScreenSize();
  }

  updateScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1251;
  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    return parts?.length > 2 ? parts[2] : '';
  }

  checkValue(value: any) {
    this.referralList = value;
  }

  ngOnInit(): void {

  }

  onSelectStatus(status: string): void {
    this.selectedStatus = status;
    this.statusSelected.emit(status);

  }

  ngOnChanges(): void {
  
    if (this.screenWidth > 1251) {
      if (this.referralList?.length > 0) {
        this.selectedReferralSK = this.referralList[0].SK;
        this.showReferralDetails.emit(this.referralList[0]);
      }
      else {
        this.showReferralDetails.emit("");
      }
      // this.showReferralDetails.emit(this.referralList?.length>0?this.referralList[0]:'');
    }
  }

  showReferralData(item: any) {
    this.selectedReferralSK = item.SK;
    this.showReferralDetails.emit(item);
  }

  get hasReferrals(): boolean {
    return this.referralList && this.referralList.length > 0;
  }

}
