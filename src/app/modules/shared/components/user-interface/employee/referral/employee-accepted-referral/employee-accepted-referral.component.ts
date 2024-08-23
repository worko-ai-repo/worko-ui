import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-employee-accepted-referral',
  templateUrl: './employee-accepted-referral.component.html',
  styleUrls: ['./employee-accepted-referral.component.scss']
})
export class EmployeeAcceptedReferralComponent {
  @Input() empdetailsList: any = "";
  @Input() empEducationList: any = "";
  @Input() empExperienceList: any = "";
  @Input() empCoreSkillsList: any = "";
  @Input() empAchievmentsList: any = "";
  @Input() empDetails: any = {};
  @Input() empEducationDetails: any = {};
  @Input() empAchievmentsDetails: any = {};
  @Input() empCoreSkillsDetails: any = {};
  @Input() empExperienceDetails: any = {};
  @Input() selectedStatus: any;
  @Input() selectedReferral: any;
  @Input() userType: any;
  @Input() refereeDetails: any;
  @Output() markAsDone = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() cancelRatingPopup = new EventEmitter<any>();
  showCard: boolean = false;
  action: string = "";
  scoreDetails: any = "";
  matchingScore:number = 0;
  profileImage: any;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  isSmallerScreen:boolean=false
  isHidden:boolean=false
  circleDiameter:number=98;

  constructor(private breakpointObserver: BreakpointObserver) {}
  score: number = 0;
  originalPoints = 2.1;
  possiblePoints = 100;
  isEmployeeReferralPage = true;

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

  ngOnChanges(changes: SimpleChanges): void {

    if (this.selectedReferral?.matchingScore === 251 || this.selectedReferral?.matchingScore === 250) {
      this.matchingScore = 0;
    } else {
      this.matchingScore = this.selectedReferral?.matchingScore;
    }
    this.scoreDetails =this.formatScoreDetails(this.selectedReferral?.scoreDetails); 

    if (this.empdetailsList?.length > 0) {

      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ? this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'

    }
   
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

  closeDetailedPopup() {
    // this.modalSize = 'md';
    this.closeModal();
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // console.log(this.docResult.awsS3SignedUrl)
    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl, '_blank');
  }

  viewDetails() {
    // this.modalSize = 'xl';
    this.openModal(ModalType.DETAILED_ANALYSIS);
  }

  formatScoreDetails(data: string): string {
    // Replacing all occurrences of \n with <br>
    return data?.replace(/\n/g, '<br>');
  }

  openDetailsModal() {
    this.openModal(ModalType.REFERRAL_DETAILS);
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
