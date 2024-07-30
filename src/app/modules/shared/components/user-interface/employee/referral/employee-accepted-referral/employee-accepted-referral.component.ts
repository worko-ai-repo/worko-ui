import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-employee-accepted-referral',
  templateUrl: './employee-accepted-referral.component.html',
  styleUrls: ['./employee-accepted-referral.component.scss']
})
export class EmployeeAcceptedReferralComponent {
  @Input() userType: any;
  @Input() selectedReferral: any;
  @Input() refereeDetails: any;
  @Output() markAsDone = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() cancelRatingPopup = new EventEmitter<any>();
  action: string = "";
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  isSmallerScreen:boolean=false
  isHidden:boolean=false
  circleDiameter:number=105;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isSmallerScreen = result.matches;
      if(this.isSmallerScreen){
        this.circleDiameter=100;
      }
    });
  
  }

  ngOnChanges(): void {
   
  }

  // referralMarkAsDone() {
  //   this.markAsDone.emit(this.selectedReferral);
  //   // this.showReferralDetails.emit(item);
  // }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit({ selectedReferral: this.selectedReferral, reviewRatingData: reviewRatingData });
  }

  cancelReviewRatingPopup() {
    this.cancelRatingPopup.emit();
  }

  referralRaiseIssue(data: any) {
    this.raiseIssue.emit(data);
  }

  markAsDoneBtn() {
     // Handling the done logic here
     this.action = "mark this referral as done";
     this.openModal(ModalType.CONFIRMATION_DIALOG);
    
  }

  doneRequest() {
    this.closeModal();
    this.action = "";
    this.markAsDone.emit(this.selectedReferral);
  }

  /**
 * Open modal.
 *
 * @param {ModalType} modalType
 * @param {string} [message = ""]
 * @param {string} [title = ""]
 * @returns {void}
 */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    this.modal.cancel();
  }

}
