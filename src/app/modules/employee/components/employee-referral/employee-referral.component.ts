import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent {

  userType = "Employee";
  empReferralList: any = "";
  emailAddress: any = "";
  userId: any;
  userName: any;
  firstName: any;
  lastName: any;
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

  constructor(private candidateSrv: CandidateProfileService, private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.userId = this.storage.get("userId");
    this.userName = this.storage.get("userName");
    this.getEmpReferral();
    // this.getEmpReferralDetails();
  }
  onStatusSelected(status: string): void {
    this.selectedStatus = status;
    this.getEmpReferral();
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
    let companySK = "01HMR3G2QNYYM47YZ2P9ZVZBPR";
    await this.empService.getEmployeeReferral(this.emailAddress, companySK, this.selectedStatus).then(async (response) => {
      if (response) {
        this.empReferralList = response;
        console.log(this.empReferralList + '123');
      }
    })

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
    const userId = this.userId;
    const payload = {
      "userId": userId,
      "action": action,
      "emailId": this.emailAddress
    }
    let referralId = this.getSlicedValue(this.selectedReferral.SK);
    await this.empService.updateReferralStatus(referralId, payload).then(async (response) => {
      if (response) {
        console.log(response);
      }
    })
  }

  async rejectAction(action: string, data: any) {
    let rejectReasonsData = data;
    console.log("rejectReasonsData");
    const userId = this.userId;
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
        console.log(response);
      }
    })

  }

  splitName(userName: any) {
    const splitName = userName.split(' ');
    this.firstName = splitName[0];
    this.lastName = splitName.length > 1 ? splitName[splitName.length - 1] : null;
  }

  async rasieIssue(data: any) {

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
        console.log(response);
      }
    })

  }

  async getReferralReview(data: any) {
    let referralId = this.getSlicedValue(data.SK);
    const forUserId = data?.acceptedByUserId;

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


}
