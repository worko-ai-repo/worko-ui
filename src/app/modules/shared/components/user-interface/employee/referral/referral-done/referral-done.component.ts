import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-referral-done',
  templateUrl: './referral-done.component.html',
  styleUrls: ['./referral-done.component.scss']
})
export class ReferralDoneComponent implements OnChanges {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() raiseIssue: EventEmitter<any> = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Input() reviewData: any = "";
  @Input() selectedReferral: any;
  @Input() empdetailsList: any = "";
  @Input() empEducationList: any = '';
  @Input() empExperienceList: any = "";
  @Input() empCoreSkillsDetails: any = '';
  @Input() selectedStatus: any;
  @Input() userType: any;
  @Input() processStatus:any;
  referralRatingFlag:any = null;
  profileImage: any;
  scoreDetails: any = "";
  matchingScore: number = 0;
  score: number = 0;
  originalPoints = 2.1;
  possiblePoints = 10;
  isEmployeeReferralPage = true;
  showRaiseIssueButton: boolean = false;
  detailedAnalysisModalSize = false;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;


  finalRating: number = 0;
  noReviewReceived: string = "No review received from the candidate!!";
  candidateName: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedReferral);
    this.referralRatingFlag = null;

    if (this.processStatus) {
      this.checkRating();
    }

    if (this.selectedReferral?.matchingScore === 251 || this.selectedReferral?.matchingScore === 250) {
      this.matchingScore = 0;
    } else {
      this.matchingScore = this.selectedReferral?.matchingScore;
    }
    this.scoreDetails =this.formatScoreDetails(this.selectedReferral?.scoreDetails); 

    if (this.empdetailsList?.length > 0) {
      this.candidateName = this.empdetailsList[0].name;
      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ? this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'
    }

    if(this.selectedStatus === 'DONE') {
      this.calculateRaiseIssueButtonVisibility();
    }
  }

  checkRating() {
    let flag = false;
    this.reviewData.forEach((element: any) => {
      if (element.ratingForUserType === 'CAND') {
        flag = true;
      }
    });
    this.referralRatingFlag = flag;
  }

  calculateRaiseIssueButtonVisibility() {
    const doneDate = this.selectedReferral?.doneByEmployee ?? this.selectedReferral?.doneByCandidate;
    const fortyEightHoursInMillis = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

    const currentTime = new Date().getTime();
    const difference = currentTime - new Date(doneDate).getTime();

    // If the time difference is less than 48 hours, show the button
    this.showRaiseIssueButton = difference < fortyEightHoursInMillis;
  }

  referralRaiseIssue(data: any) {
    this.raiseIssue.emit(data);
  }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit(reviewRatingData);
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // console.log(this.docResult.awsS3SignedUrl)
    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl, '_blank');
  }

  viewDetails() {
    this.detailedAnalysisModalSize = true;
    this.openModal(ModalType.DETAILED_ANALYSIS);
  }

  closeDetailedPopup() {
    this.detailedAnalysisModalSize = false;
    this.closeModal();
  }

  formatScoreDetails(data: string): string {
    // Replacing all occurrences of \n with <br>
    return data.replace(/\n/g, '<br>');
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
