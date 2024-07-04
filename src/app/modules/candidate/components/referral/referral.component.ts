import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { CandidateDropdownService } from 'src/app/modules/services/candidate-dropdown.service';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  userType = "Candidate";
  userId: any;
  userName: any;
  firstName: any;
  lastName: any;
  referralList: any = "";
  emailAddress: any = "";
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;
  reviewData: any = null;
  refereeDetails: any;
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  processStatus = false;
  showModal: ModalType | undefined;
  statusItem: { name: string; status: string; date: any; }[] = [];
  constructor(private candidateSrv: CandidateProfileService, private router: Router, private storage: StorageService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.userId = this.storage.get("userId");
    this.userName = this.storage.get("userName");
    this.getReferral();
    this.onStatusSelected('AWAITING');
  }

  async getReferral() {
    this.spinner.show();
    await this.candidateSrv.getReferral(this.emailAddress, this.selectedStatus).then(async (response) => {
      if (response) {
        this.spinner.hide();
        this.referralList = response;
        this.referralList.sort((a: any, b: any) => a.updatedAt < b.updatedAt ? 1 : -1);
       
        // this.getRefereeDetials(response.accc);
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin','/candidate/referral'); 
       this.router.navigate(['/']);
      }
      this.spinner.hide();
      this.referralList = [];
    }
    );
  }

  async getRefereeDetials(data: any) {
    if (data.acceptedByUserId && (this.selectedStatus == 'ACCEPTED' || this.selectedStatus == 'DONE')) {
      await this.candidateSrv.getUserDetailsById(data.acceptedByUserId).then(async (response) => {
        if (response) {
          this.refereeDetails = response;
        }
      })
    }
    else {
      return;
    }
  }

  onStatusSelected(status: string): void {
    this.selectedReferral = "";
    this.selectedStatus = status;
    this.getReferral();
    if (status === 'REJECTED') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Rejected', status: '', date: '' }]
    }
    else if (status === 'CANCELLED') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Cancelled', status: '', date: '' }]
    }
    else if (status === 'WITHDRAWN') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Withdrawn', status: '', date: '' }];
    }
    else if (status === 'DONE') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Accepted', status: '', date: '' },
      { name: 'Done', status: '', date: '' }];
    }
    else {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Accepted', status: '', date: '' },
      { name: 'OnGoing', status: '', date: '' },
      { name: 'Done', status: '', date: '' }];
    }
  }

  async showReferralDetails(data: any) {
    if (data) {
      this.processStatus = false;
      this.reviewData = null;
      this.selectedReferral = data;
      this.refereeDetails = "";
      this.getRefereeDetials(this.selectedReferral);
      if (this.selectedStatus == 'DONE') {
        this.reviewData = [];
        let referralId = this.getSlicedValue(this.selectedReferral?.SK);
        let forUserId = this.selectedReferral?.acceptedByUserId;

        await this.getReferralReview(referralId, this.userId);
        this.getReferralReview(referralId, forUserId, true);
        
      }
    }
    else {
      this.selectedReferral = data;
    }

  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }


  async referralMarkAsDone(data: any) {
    this.spinner.show();
    let referralId = this.getSlicedValue(data.SK);
    await this.candidateSrv.markasDoneReferral(this.emailAddress, "DONE", referralId).then(async (response) => {
      if (response) {
        // this.referralList = response;
        this.spinner.hide();
     
        this.openModal(ModalType.REFERRAL_RATING);
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/candidate/referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
    
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
    );
  }

  async createReview(data: any) {

    this.spinner.show();
    const userId = this.userId;
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    const forUserId = this.selectedReferral?.acceptedByUserId;

    let payload = {
      "ratingByUserId": userId,
      "ratingForUserType": "EMP",
      "rating": data.rating,
      "reviewText": data.review,
      "createdByUserId": userId,
      "updatedByUserId": userId,
      "reviewContext": "EMP_REFERRAL",
      "referalId": referralId,
      // "masterServiceCode": "RESUME_REVIEW", 
      // "serviceReqId": "req789" 
    }
    await this.candidateSrv.createReview(forUserId, payload).then(async (response) => {
      if (response) {
        // this.getReferralReview(this.selectedReferral);
        if (this.selectedStatus == 'DONE') {
          this.reviewData = [];
          let referralId = this.getSlicedValue(this.selectedReferral?.SK);
          let forUserId = this.selectedReferral?.acceptedByUserId;
          await this.getReferralReview(referralId, this.userId);
          this.getReferralReview(referralId, forUserId, true);
         
        }
        this.spinner.hide();
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/candidate/referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
      }
    }
    );

  }

  async getReferralReview(referralId: any, forUserId: any, executeProcessedStatus = false) {
    // let referralId = this.getSlicedValue(this.selectedReferral.SK);
    // const forUserId = data?.acceptedByUserId;

    await this.candidateSrv.getReview(forUserId, referralId).then(async (response) => {
      if (executeProcessedStatus) {
        this.processStatus = true;
      }
     
      let backupReview = JSON.parse(JSON.stringify(this.reviewData));
      this.reviewData = [];
      if (response) {
        
        response.forEach((element: any) => {
          if (element.referalId == referralId) {
            backupReview.push(element);
          }
        });
        this.reviewData = JSON.parse(JSON.stringify(backupReview));

      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/candidate/referral'); 
       this.router.navigate(['/']);
      }else if (executeProcessedStatus) {
        this.processStatus = true;
      }
      this.reviewData = [];
    
    }
    );


  }

  splitName(userName: any) {
    const splitName = userName.split(' ');
    this.firstName = splitName[0];
    this.lastName = splitName.length > 1 ? splitName[splitName.length - 1] : "";
  }

  async rasieIssue(data: any) {
    this.spinner.show();
    this.splitName(this.userName);
    const firstName = this.firstName;
    const lastName = this.lastName;
    const userId = this.userId;
    const emailAddress = this.emailAddress;
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    // const forUserId = data.selectedReferral.acceptedByUserId;

    let payload = {

      // "userId": userId, // ID of the user raising the concern
      "userEmail": emailAddress, // Email of the user raising the concern
      "userFirstName": firstName, // First name of the user raising the concern
      "userLastName": lastName, // Last name of the user raising the concern
      "userRole": "CAND", // Role of the user raising the concern (should be one of the UserType enum values)
      "userSupportType": data.raiseIssueContent.issueTitle,   // Type of support requested
      "userMessage": data.raiseIssueContent.issueDescription,
      "contextType": "REFERRAL",
      "contextId": referralId,
      // "createdByUserId": userId

    }
    await this.candidateSrv.raiseIssue(payload).then(async (response) => {
      if (response) {
        this.spinner.hide();
        
        this.successmessage = "An issue has been raised for this request. You will get an e-mail for further communication.";
        this.successtitle = "";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/candidate/referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
     
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
    );

  }

  async withdrawReferralRequest(data: any) {

    this.spinner.show();
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    let payload = {
      "reason": data.withdrawReason,
      "userComment": data.withdrawComments,
    }

    await this.candidateSrv.withdrawReferral(this.emailAddress, "WITHDRAWN", referralId, payload).then(async (response) => {
      if (response) {
        this.spinner.hide();
        // this.successmessage = "This referral request is withdrawn successfully.";
        // this.successtitle = "Congratulations!";
        // this.openModal(ModalType.SUCCESS_MESSAGE);
        this.getReferral();
        
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/candidate/referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
    );

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
    // this.referrralComponent.showReferrelRow = true;
    this.modal.cancel();
  }

  continue() {
    this.closeModal();
    //window.location.reload();
  }

  cancel() {
    this.closeModal();
  }

  referralWithdraw(data: any) {
   
    this.withdrawReferralRequest(data);
  }

  referralRaiseIssue(data: any) {
  
    this.rasieIssue(data);
  }

  async receiveDataFromChild(reviewRatingData: any) {
    this.createReview(reviewRatingData);
    if (this.selectedStatus === 'ACCEPTED') {
      this.getReferral();
    }
    this.closeModal();
  }

  cancelReviewRatingPopup() {
    if (this.selectedStatus === 'ACCEPTED') {
      this.getReferral();
    }
    this.closeModal();
  }
}
