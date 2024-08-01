import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';
@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent implements OnDestroy {
  @ViewChild(ModalComponent) modal!: ModalComponent;

  userType = "Employee";
  empReferralList: any = "";
  emailAddress: any = "";
  userId: any;
  userName: any;
  firstName: any;
  lastName: any;
  // currentCompanySK: any;
  currentCompanyId: any;
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
  processStatus = false;
  isEmailVerified: boolean = false;
  showModal: ModalType | undefined;
  statusItem: { name: string; status: string; date: any; }[] = [];
  candidateDetails: any;
  workExperienceDetails: any;
  popupStatus:boolean = false;
  isAwaitingVisible!:boolean;
  // isStepperVisible = true;
  isMainContentVisible!:boolean;
  screenWidth!: number;
  previousScreenWidth!: number;

  constructor(private candidateSrv: CandidateProfileService, private empService: EmployeeProfileService, private storage: StorageService, private spinner: NgxSpinnerService, private router: Router, private stateService: StateService) { }
  ngOnDestroy(): void {
    this.closeModal();
   
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.performFunctionalityBasedOnScreenSize();
    this.previousScreenWidth = this.screenWidth;
    this.emailAddress = this.storage.get("useremail");
    this.userId = this.storage.get("userId");
    this.userName = this.storage.get("userName");
    // this.currentCompanySK = this.storage.get("currentCompanySK");
    this.currentCompanyId = this.storage.get("currentCompanyId");
    this.getWorkExperienceDetails();
    // this.getCandidateDetails();
    // this.getEmpReferralDetails();
  
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.performFunctionalityBasedOnScreenSize();
    this.previousScreenWidth = this.screenWidth;
  }
  onClickBack(){
   
    this.isMainContentVisible = false;
    this.isAwaitingVisible = true;
  }
  
  performFunctionalityBasedOnScreenSize() {
    if (this.screenWidth < 1251) {
      // Set values only if transitioning from a width >= 1251 or on initial load
      if (this.previousScreenWidth === undefined || this.previousScreenWidth >= 1251) {
        this.isAwaitingVisible = true;
        this.isMainContentVisible = false;
      }
    } else {
      // Always set values when width is >= 1251
      this.isAwaitingVisible = true;
      this.isMainContentVisible = true;
    }
  }

  // Manually checking here screen size and performing actions
  checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.performFunctionalityBasedOnScreenSize();
  }


  async getWorkExperienceDetails() {
    this.spinner.show()
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (response) {
        this.workExperienceDetails = response;
        this.workExperienceDetails.forEach((element: any) => {
          if (element?.isCurrent == true && element?.isEmailVerified) {
            this.currentCompanyId = element?.companyId; //extra line to re-assure that the companyId value should not be null
            // this.getEmpReferral(); //commented mutiple times same API call
            this.onStatusSelected('AWAITING');
            this.popupStatus = true;
          }
        });
        if (!this.popupStatus) {
          this.spinner.hide();
          // this.successmessage = "Please verify the email to see the referral requests!!"
          this.successtitle = "";
          this.openModal(ModalType.VERIFY_EMAIL);
        }
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/employee/Referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
     
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    });
  }

  // async getCandidateDetails() {
  //   this.spinner.show()
  //   await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
  //     if (response) {
  //       this.candidateDetails = response[0];
  //       if(this.candidateDetails?.isEmailVerified) {
  //         this.getEmpReferral();
  //         this.onStatusSelected('AWAITING');
  //       }
  //       else {
  //         this.spinner.hide();
  //         // this.successmessage = "Please verify the email to see the referral requests!!"
  //         this.successtitle = "";
  //         this.openModal(ModalType.VERIFY_EMAIL);
  //       }
  //     }
  //   }).catch((error: any) => {
  //     this.spinner.hide();
  //     console.log(error);
  //     this.successmessage = "Something went wrong. Please try again after sometime"
  //     this.successtitle = "Error"
  //     this.openModal(ModalType.SUCCESS_MESSAGE);
  //   });
  // }

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
    else if (status === 'REFERRED') {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Accepted', status: '', date: '' },
      { name: 'Referred', status: '', date: '' }];
    }
    else {
      this.statusItem = [{ name: 'Awaiting', status: '', date: '' },
      { name: 'Accepted', status: '', date: '' },
      { name: 'OnGoing', status: '', date: '' },
      { name: 'Referred', status: '', date: '' }];
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
    let companyId = this.currentCompanyId;
    // let companyId = this.getSlicedValue(this.currentCompanySK);
    const selectedStatus = this.selectedStatus === 'REFERRED' ? 'DONE' : this.selectedStatus;
    await this.empService.getEmployeeReferral(this.emailAddress, companyId, selectedStatus).then(async (response) => {
      if (response) {
        this.spinner.hide();
        if (response.length > 0) {
          response.forEach((element: any, index: any) => {
            if (Array.isArray(element)) {
              response[index] = element[0];
            }
          });
        }
        this.empReferralList = response;
        this.empReferralList.sort((a: any, b: any) => a.updatedAt < b.updatedAt ? 1 : -1);
  
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin','/employee/Referral'); 
       this.router.navigate(['/']);
      }
      this.spinner.hide();
      this.empReferralList = [];
    }
    );

  }
  async getEmpReferralDetails(selectedUserEmail: any) {
    await this.candidateSrv.getUserDetails(selectedUserEmail).then(async (response) => {
      this.empdetailsList = response;
      this.empDetails = this.empdetailsList;

    
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
   
    })
    this.getEmpAchievments(selectedUserEmail);
  }
  async getEmpAchievments(selectedUserEmail: any) {
    await this.candidateSrv.getCandidateAchievements(selectedUserEmail).then(async (response) => {
      this.empAchievmentsDetails = response;
    })
  }

  async showReferralDetails(data: any) {
   
    if (data) {
      this.processStatus = false;
      this.reviewData = null;
      this.selectedReferral = data;
      if(this.screenWidth <= 1251) {
        this.isAwaitingVisible = false;
        this.isMainContentVisible = true;
      }
      const selectedEmail = this.getSlicedValue(this.selectedReferral?.PK);
     
      await this.getEmpReferralDetails(selectedEmail);
      if (this.selectedStatus == 'REFERRED') {
        this.reviewData = [];
        let referralId = this.getSlicedValue(this.selectedReferral?.SK);
        let forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);
        await this.getReferralReview(referralId, this.userId);
        this.getReferralReview(referralId, forUserId, true);
        
      }
    }
    else {
      this.selectedReferral = data;
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
       
        if (action === 'ACCEPT' || this.selectedStatus === 'AWAITING') {
          // this.successmessage = "Referral request accepted successfully.";
          // this.successtitle = "Congratulations!";
          // this.openModal(ModalType.SUCCESS_MESSAGE);
          this.getEmpReferral();
        }

        // else if (action === 'DONE') {
        //   this.successmessage = "Referral marked as done successfully.";
        //   this.successtitle = "Congratulations!";
        // }
        if (action === 'DONE') {
          this.openModal(ModalType.REFERRAL_RATING);
        }
      }
    }).catch((error: any) => {
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else if (error.status==401){
        this.storage.set('redirectAfterLogin', '/employee/Referral'); 
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

  async rejectAction(action: string, data: any) {
    this.spinner.show();
    let rejectReasonsData = data;
   
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
      
        this.successmessage = "You have rejected the Candidate's request. Thanks for putting your feedback.";
        this.successtitle = "";
        this.openModal(ModalType.SUCCESS_MESSAGE);
        this.getEmpReferral();
      }
    }).catch((error: any) => {
      this.spinner.hide();
      
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
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
      "userRole": "EMP", // Role of the user raising the concern (should be one of the UserType enum values)
      "userSupportType": data.issueTitle,   // Type of support requested
      "userMessage": data.issueDescription,
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
      this.spinner.hide();
      
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }
    );

  }

  async createReview(data: any) {

    this.spinner.show();
    const userId = this.userId;
    let referralId = this.getSlicedValue(this.selectedReferral?.SK);
    let forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);
    // forUserId = this.empdetailsList[0].id;

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
       
        // this.getReferralReview(this.selectedReferral);
        if (this.selectedStatus == 'REFERRED') {
          this.reviewData = [];
          let referralId = this.getSlicedValue(this.selectedReferral?.SK);
          let forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);
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
        this.storage.set('redirectAfterLogin', '/employee/Referral'); 
       this.router.navigate(['/']);
      }else{
      this.spinner.hide();
      }
      
    }
    );

  }

  async getReferralReview(referralId: any, forUserId: any, executeProcessedStatus = false) {
    // let referralId = this.getSlicedValue(data.SK);
    // const forUserId = this.getSlicedValue(this.empdetailsList[0]?.SK);

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
      if (executeProcessedStatus) {
        this.processStatus = true;
      }
      this.reviewData = [];
     
    }
    );


  }

  referralRaiseIssue(data: any) {
   
    this.rasieIssue(data);
  }

  async receiveDataFromChild(reviewRatingData: any) {
    // await this.createReview(reviewRatingData);
    this.createReview(reviewRatingData);
  
    if (this.selectedStatus === 'ACCEPTED') {
      this.getEmpReferral();
    }
    this.closeModal();
  }

  cancelReviewRatingPopup() {
    if (this.selectedStatus === 'ACCEPTED') {
      this.getEmpReferral();
    }
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

  continueToEditDetails() {
    this.spinner.hide();
    this.closeModal();
    this.stateService.setState(true);
    this.router.navigate(['/employee/Edit-profile'], { queryParams: { from: 'EmployeeReferralComponent' } });
  }

  cancel() {
    this.closeModal();
  }
}
