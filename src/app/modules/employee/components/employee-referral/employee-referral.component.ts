import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;

  userType = "Employee";
  empReferralList: any = "";
  emailAddress: any = "";
  userId: any;
  userName: any;
  firstName: any;
  lastName: any;
  currentCompanySK: any;
  reviewData: any = null;
  empdetailsList: any = "";
  empEducationList: any = "";
  empExperienceList: any = "";
  empCoreSkillsList: any = "";
  empAchievmentsList: any = "";
  empAchievmentsDetails: any = {};
  empCoreSkillsDetails: any = {};
  empExperienceDetails: any = {};
  empEducationDetails: any = {};
  empDetails: any = {};
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;
  currentDate: any;
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  statusItem: { name: string; status: string; date: any; }[] = [];

  constructor(private candidateSrv: CandidateProfileService, private empService: EmployeeProfileService, private storage: StorageService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.userId = this.storage.get("userId");
    this.userName = this.storage.get("userName");
    this.currentCompanySK = this.storage.get("currentCompanySK");
    this.getEmpReferral();
    this.onStatusSelected('AWAITING');
    // this.getEmpReferralDetails();
  }
  onStatusSelected(status: string): void {
    this.selectedReferral = "";
    this.selectedStatus = status;
    this.getEmpReferral();
    if (status === 'REJECTED') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Rejected', status: '', date: '' }]
    }
    else if (status === 'CANCELLED') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Cancelled', status: '', date: '' }]
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

  // getSlicedValue(value: string): string {
  //   const parts = value?.split('#');
  //   return parts?.length > 2 ? parts[2] : '';
  // }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    if (parts && parts.length > 1) {
      return parts.length > 2 ? parts[2] : parts[1];
    }
    return '';
  }



  async getEmpReferral() {
    this.spinner.show();
    // let companySK = "01HMR3G2QNYYM47YZ2P9ZVZBPR";
    // let companyId = this.currentCompanyId
    let companyId = this.getSlicedValue(this.currentCompanySK);
    await this.empService.getEmployeeReferral(this.emailAddress, companyId, this.selectedStatus).then(async (response) => {
      if (response) {
        this.spinner.hide();
        this.empReferralList = response;
        console.log(this.empReferralList + '123');
      }
    }).catch((error: any) => {
      this.spinner.hide();
      this.empReferralList = [];
    }
    );

  }
  async getEmpReferralDetails(selectedUserEmail: any) {
    await this.candidateSrv.getUserDetails(selectedUserEmail).then(async (response) => {
      this.empdetailsList = response;
      this.empDetails = this.empdetailsList;

      console.log('Employee details===>', this.empdetailsList);
    })
    this.getEmpEducationDetails(selectedUserEmail);
  }
  async getEmpEducationDetails(selectedUserEmail: any) {
    await this.candidateSrv.getCandidateEducation(selectedUserEmail).then(async (response) => {
      this.empEducationList = response;
      this.empEducationDetails = this.empEducationList;
    })
    this.getWorkExperience(selectedUserEmail);
  }
  async getWorkExperience(selectedUserEmail: any) {
    await this.candidateSrv.getWorkExperience(selectedUserEmail).then(async (response) => {
      this.empExperienceList = response;
      this.empExperienceDetails = this.empExperienceList;
    })
    this.getCoreSkills(selectedUserEmail);
  }
  async getCoreSkills(selectedUserEmail: any) {
    await this.candidateSrv.getCandidateSkills(selectedUserEmail).then(async (response) => {

      this.empCoreSkillsDetails = response; // Assign response to empCoreSkillsDetails
      console.log(this.empCoreSkillsDetails);
    })
    this.getEmpAchievments(selectedUserEmail);
  }
  async getEmpAchievments(selectedUserEmail: any) {
    await this.candidateSrv.getCandidateAchievements(selectedUserEmail).then(async (response) => {
      this.empAchievmentsDetails = response;
    })
  }

  showReferralDetails(data: any) {
    this.reviewData = null;
    this.selectedReferral = data;
    const selectedEmail = this.getSlicedValue(this.selectedReferral.PK);
    console.log(selectedEmail);
    this.getEmpReferralDetails(selectedEmail);
    if (this.selectedStatus == 'DONE') {
      this.getReferralReview(this.selectedReferral);
    }
  }

  // getCurrentDateISO() {
  //   var currentDate = new Date();
  //   var currentDateISO = currentDate.toISOString();
  //   return currentDateISO;
  // }

  // async referralAccepted() {
  //   const userId = this.getSlicedValue(this.userId);
  //   const payload = {
  //     "userId": userId,
  //     "action": "ACCEPT",
  //     "emailId": this.emailAddress
  //   }
  //   let referralId = this.getSlicedValue(this.selectedReferral.SK);
  //   await this.empService.updateReferralStatus(referralId, payload).then(async (response) => {
  //     if (response) {
  //       console.log(response);
  //     }
  //   })
  // }

  async referralAction(action: string) {
    this.spinner.show();
    const userId = this.userId;
    // let currentDate = this.getCurrentDateISO();
    const payload = {
      "userId": userId,
      "action": action,
      "emailId": this.emailAddress,
      // "acceptedAtByUser": currentDate
    }
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    await this.empService.updateReferralStatus(referralId, payload).then(async (response) => {
      if (response) {
        this.spinner.hide();
        console.log(response);
        if (action === 'ACCEPT') {
          this.successmessage = "Referral request accepted successfully.";
          this.successtitle = "Congratulations!";
          this.openModal(ModalType.SUCCESS_MESSAGE);
        }

        // else if (action === 'DONE') {
        //   this.successmessage = "Referral marked as done successfully.";
        //   this.successtitle = "Congratulations!";
        // }
        if (action === 'DONE') {
          this.openModal(ModalType.REFERRAL_RATING);
        }
        this.getEmpReferral();
      }
    }).catch((error: any) => {
      this.spinner.hide();
      console.log(error);
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }
    );
  }

  async rejectAction(action: string, data: any) {
    this.spinner.show();
    let rejectReasonsData = data;
    console.log("rejectReasonsData");
    const userId = this.userId;
    // let currentDate = this.getCurrentDateISO();
    const payload = {
      "userId": userId,
      "action": action,
      "emailId": this.emailAddress,
      "reason": rejectReasonsData.rejectTitle,
      "userComment": rejectReasonsData.rejectComments
    }
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    await this.empService.updateReferralStatus(referralId, payload).then(async (response) => {
      if (response) {
        this.spinner.hide();
        console.log(response);
        this.successmessage = "Referral request rejected successfully.";
        this.successtitle = "Congratulations!";
        this.openModal(ModalType.SUCCESS_MESSAGE);
        this.getEmpReferral();
      }
    }).catch((error: any) => {
      this.spinner.hide();
      console.log(error);
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }
    );

  }

  splitName(userName: any) {
    const splitName = userName.split(' ');
    this.firstName = splitName[0];
    this.lastName = splitName.length > 1 ? splitName[splitName.length - 1] : null;
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

      "userId": userId, // ID of the user raising the concern
      "userEmail": emailAddress, // Email of the user raising the concern
      "userFirstName": firstName, // First name of the user raising the concern
      "userLastName": lastName, // Last name of the user raising the concern
      "userRole": "EMP", // Role of the user raising the concern (should be one of the UserType enum values)
      "userSupportType": data.issueTitle,   // Type of support requested
      "userMessage": data.issueDescription,
      "contextType": "REFERRAL",
      "contextId": referralId,
      "createdByUserId": userId

    }
    await this.candidateSrv.raiseIssue(payload).then(async (response) => {
      if (response) {
        this.spinner.hide();
        console.log(response);
        this.successmessage = "Issue raised successfully.";
        this.successtitle = "Congratulations!";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }).catch((error: any) => {
      this.spinner.hide();
      console.log(error);
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }
    );

  }

  async createReview(data: any) {

    const userId = this.userId;
    let referralId = this.getSlicedValue(this.selectedReferral?.SK);
    const forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);

    let payload = {
      "ratingByUserId": userId,
      "ratingForUserType": "CAND",
      "rating": data?.rating,
      "reviewText": data?.review,
      "createdByUserId": userId,
      "updatedByUserId": userId,
      "reviewContext": "CAND_USER",
      "referalId": referralId,
      // "masterServiceCode": "RESUME_REVIEW", 
      // "serviceReqId": "req789" 
    }
    await this.candidateSrv.createReview(forUserId, payload).then(async (response) => {
      if (response) {
        console.log(response);
        this.getReferralReview(this.selectedReferral);
      }
    })

  }

  async getReferralReview(data: any) {
    let referralId = this.getSlicedValue(data.SK);
    const forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);

    await this.candidateSrv.getReview(forUserId, referralId).then(async (response) => {
      console.log(response);
      this.reviewData = [];
      if (response) {
        console.log(response);
        response.forEach((element: any) => {
          if (element.referalId == referralId) {
            this.reviewData.push(element);
          }

        });
      }
    }).catch((error: any) => {
      this.reviewData = [];

      console.log(error);
    }
    );


  }

  referralRaiseIssue(data: any) {
    console.log(data);
    this.rasieIssue(data);
  }

  async receiveDataFromChild(reviewRatingData: any) {
    console.log(reviewRatingData);
    this.createReview(reviewRatingData);
    this.closeModal();
  }

  cancelReviewRatingPopup() {
    this.closeModal();
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
}
