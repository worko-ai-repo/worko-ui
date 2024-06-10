import { Component, ElementRef, ViewChild } from "@angular/core";
import { EmployeeProfileService } from "../../services/employee-profile.service";
import { StorageService } from "src/app/modules/app-core/services/storage.service";
import { CandidateProfileService } from "src/app/modules/candidate/services/candidate-profile.service";
import { AuthService } from "src/app/modules/worko/services/auth.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { StateService } from "../../services/state.service";
@Component({
  selector: "app-employee-edit",
  templateUrl: "./employee-edit.component.html",
  styleUrls: ["./employee-edit.component.scss"],
})
export class EmployeeEditComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  workExperienceDetailsList: any;
  currentStep: number = 1;
  emailAddress: string = "";
  // employeeList:any[]=[];
  employeeSocial: any;
  employeeDetails: any;
  firstStepData: any;
  secondStepData: any;
  thirdStepData: any;
  employeePersonalData: any;
  employeeBankDetails: any;
  employeeProfessionalData: any;
  workExperienceDetails: any;
  bankDetails: any;
  uploadedProfilePicName: string = "";

  companyId: any = "";
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private empService: EmployeeProfileService,
    private candidateSrv: CandidateProfileService,
    private storage: StorageService,
    public stateService: StateService
  ) {}

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getEmployeeDetails();
  }

  nextStep() {
    //debugger
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  nextStepThird(data: any) {
    // debugger
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.secondStepData = data;
    this.employeeProfessionalData = data;
  }

  nextStepSecond(data: any) {
    // debugger
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.firstStepData = data;
    this.employeePersonalData = data;
  }
  previousStep() {
    //debugger
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  previousStepSecond(data: any) {
    //debugger
    this.thirdStepData = data;
    this.employeeBankDetails = data;
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  // Get API //
  async getEmployeeDetails() {
    this.spinner.show();
    try {
      await this.candidateSrv
        .getUserDetails(this.emailAddress)
        .then(async (response) => {
          if (response) {
            this.employeeDetails = response[0];
            await this.getSocialProfile();
          }
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }
  onSuccess(data: any) {
    this.thirdStepData = data;
    this.updateProfilePic();
    // this.updateWorkExperience();
    this.spinner.show();
  }
  async getSocialProfile() {
    try {
      await this.candidateSrv
        .getUserProfile(this.emailAddress)
        .then(async (response) => {
          if (response) {
            this.employeeSocial = response[0];
            console.log(this.employeeSocial);
          }
          this.getWorkExperienceDetails();
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async updateProfilePic(): Promise<void> {
    this.spinner.show();
    try {
      // if (this.userId && this.thirdStepData.fileType && this.thirdStepData.fileName) {
      if (this.firstStepData.fileType && this.firstStepData.fileName) {
        let documentDetails = {
          // userId: this.userId,
          userId: this.employeeDetails.SK.split("#")[1],
          profileUserFileName: this.firstStepData.fileName,
          profileFileMimeType: this.firstStepData.fileType,
        };
        let docResult = await this.candidateSrv.uploadProfilePic(
          documentDetails
        );
        console.log(docResult);

        this.uploadedProfilePicName = docResult.cloudFileName;
        this.employeeDetails.profileImage = docResult.cloudFileName;
        this.uploadProfilePiconS3Bucket(docResult);
      } else {
        this.updateWorkExperience();
      }
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  uploadProfilePiconS3Bucket(docResult: any) {
    try {
      this.authService
        .uploadFileOnS3Bucket(
          this.firstStepData.fileToUpload!,
          docResult.awsS3SignedUrl,
          docResult.awsS3Tag
        )
        .then(async () => {
          console.log("File uploaded successfully.");
          try {
            // let a = await this.authService.linkResumewithUser(this.emailAddress, this.uploadedProfilePicName);

            await this.updateWorkExperience();
          } catch (error: any) {
            if (error && error.error.message) {
              this.spinner.hide();
              this.successmessage =
                "Something went wrong. Please try again after sometime";
              this.successtitle = "Error";
              this.openModal(ModalType.SUCCESS_MESSAGE);
              // this.errorMessage = error.error.message;
              // this.setErrorMessage('File Link error linkResumewithUser:- '+ error.error.message);
            }
            this.spinner.hide();
            this.successmessage =
              "Something went wrong. Please try again after sometime";
            this.successtitle = "Error";
            this.openModal(ModalType.SUCCESS_MESSAGE);
            console.error("File Link error linkResumewithUser:", error);
          }
        })
        .catch((error) => {
          this.spinner.hide();
          this.successmessage =
            "Something went wrong. Please try again after sometime";
          this.successtitle = "Error";
          this.openModal(ModalType.SUCCESS_MESSAGE);

          console.error("File upload error:", error);
        });
    } catch (error) {
      this.spinner.hide();
      this.successmessage =
        "Something went wrong. Please try again after sometime";
      this.successtitle = "Error";
      this.openModal(ModalType.SUCCESS_MESSAGE);
      console.log(error);
    }
  }

  async updateWorkExperience() {
    // console.log(this.workExperienceDetails)
    // console.log(this.employeeProfessionalData)
    // try{
    //     let workExperience =
    //       [{
    //         "companyName": this.secondStepData?.companyName,
    //         "companySK": this.secondStepData?.companySK,
    //         "emailId": this.secondStepData?.officialEmail,
    //         "designation": this.secondStepData?.designation,
    //         "department": this.secondStepData?.department,
    //         "SK": this.workExperienceDetails ? this.workExperienceDetails.SK : "",
    //         "PK": this.workExperienceDetails ? this.workExperienceDetails.PK : "",
    //         "experienceInMonths": this.secondStepData?.workingSince,
    //         "userType":"EMP",
    //          "isCurrent": this.secondStepData?.isCurrent ? this.secondStepData?.isCurrent : true

    //       }
    //       ]
    // await this.candidateSrv.createWorkExperience(this.emailAddress, workExperience).then(async (response) => {

    //   // if (response) {
    //   this.creatSocialProfile();
    //   // }
    // })
    //console.log(this.employeeProfessionalData.previousCompanies)

    try {
      let workExperience = [];
      // debugger
      // Add current company details
      if (this.secondStepData) {
        if (this.secondStepData.companySK.includes("ID#")) {
          this.companyId = this.getSlicedValue(this.secondStepData.companySK);
        } else {
          this.companyId = this.secondStepData.companySK;
        }
        workExperience.push({
          companyName: this.secondStepData.companyName,
          companyId: this.companyId,
          emailId: this.secondStepData.officialEmail,
          designation: this.secondStepData.designation,
          department: this.secondStepData.department,
          SK: this.workExperienceDetails ? this.workExperienceDetails.SK : "",
          PK: this.workExperienceDetails ? this.workExperienceDetails.PK : "",
          experienceInMonths: this.secondStepData.workingSince,
          userType: "EMP",
          isCurrent:
            this.secondStepData.isCurrent !== undefined
              ? this.secondStepData.isCurrent
              : true,
        });
      }
      console.log(this.secondStepData);
      console.log(this.employeeProfessionalData.previousCompanies);

      if (this.employeeProfessionalData.previousCompanies) {
        workExperience.push(
          ...this.employeeProfessionalData.previousCompanies.map(
            (previousCompany: any) => {
              return {
                companyName: previousCompany.previousCompanyName,
                designation: previousCompany.previousDesignation,
                companySK: previousCompany.companyPastSK,
                SK: previousCompany.sk ? previousCompany.sk : "",
                PK: previousCompany.pk ? previousCompany.pk : "",
                department: "frontend",
                emailId: this.secondStepData.officialEmail,
                experienceInMonths: previousCompany.previousExperience,
                userType: "EMP",
                isCurrent: false, // Assuming isCurrent is always false for previous companies
              };
            }
          )
        );
      }
      console.log(workExperience);
      await this.candidateSrv
        .createWorkExperience(this.emailAddress, workExperience)
        .then(async (response) => {
          this.creatSocialProfile();
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async creatSocialProfile() {
    // debugger
    var twitterArray: string[] = this.firstStepData.socialLinktwitter || [];
    var linkedinArray: string[] = this.firstStepData.socialLinklinkdin || [];
    var githubArray: string[] = this.firstStepData.socialLinkGithub || [];
    // var twitterArray = this.firstStepData.socialLinktwitter;
    // var linkedinArray = this.firstStepData.socialLinklinkdin;
    // var githubArray = this.firstStepData.socialLinkGithub;
    // Check if twitterArray is an array
    if (twitterArray.length > 2) {
      console.log("twitterArray is already an array");
      console.log(this.firstStepData.socialLinktwitter);
      twitterArray = [this.firstStepData.socialLinktwitter];
    } else if (twitterArray.length == 1) {
      console.log("twitterArray is already an array");
      twitterArray = this.firstStepData.socialLinktwitter;
    } else {
      console.log("twitterArray is not an array");
      twitterArray = [];
    }

    // Check if twitterArray is an array
    console.log(linkedinArray.length);
    if (linkedinArray.length > 2) {
      linkedinArray = [this.firstStepData.socialLinklinkdin];
      console.log("linkedinArray is already an array");
    } else if (linkedinArray.length == 1) {
      linkedinArray = this.firstStepData.socialLinklinkdin;
    } else {
      console.log("linkedinArray is not an array");
      linkedinArray = [];
    }
    console.log(githubArray.length);
    if (githubArray.length > 2) {
      console.log("githubArray is already an array");

      githubArray = [this.firstStepData.socialLinkGithub];
    } else if (githubArray.length == 1) {
      githubArray = this.firstStepData.socialLinkGithub;
    } else {
      console.log("githubArray is not an array");
      githubArray = [];
    }
    let socialProfile = {
      twitter: twitterArray,
      github: githubArray,
      linkedin: linkedinArray,
      SK: this.employeeSocial?.SK,
      PK: this.employeeSocial?.PK,
      //  SK: this.firstStepData?.socialSk,
      //  PK: this.firstStepData?.socialPk
    };
    try {
      await this.candidateSrv
        .createUserProfile(this.emailAddress, socialProfile)
        .then(async (response) => {
          // if (response) {
          // console.log(socialProfile)
          this.createUserDetails();
          // }
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async createUserDetails() {
 // Define candidateExperience object
const candidateExperience = {
  department: this.employeeDetails?.candidateExperience?.department ?? "",
  companyName: this.employeeDetails?.candidateExperience?.companyName ?? "",
  designation: this.employeeDetails?.candidateExperience?.designation ?? "",
};

    let userDetails: any = {

      ECTC: this.secondStepData.ectc,
      location: this.firstStepData.location,
      coverLetter: this.thirdStepData.coverLetter,
      name: this.firstStepData.name,
      CTC: this.secondStepData.ctc,
      emailList: {
        primary: this.firstStepData.email,
      },
      CV: this.employeeDetails.uploadCV,
      about: this.firstStepData.about,
      number: this.firstStepData.number,
      noticePeriod: this.secondStepData.noticePeriod,
      userType: this.employeeDetails.userType,
      linkedinUrl: this.employeeDetails.linkedinUrl,
      isEmailVerified: this.employeeDetails.isEmailVerified,
      isNumberVerified: this.employeeDetails.isNumberVerified,
      isSubscribed: this.employeeDetails.isSubscribed,
      referralCount: this.employeeDetails.referralCount,
      YOE: this.employeeDetails.YOE,
      lastAccessedDash: this.employeeDetails.lastAccessedDash,
      SK: this.employeeDetails?.SK,
      PK: this.employeeDetails?.PK,
      country: this.firstStepData?.country,
      profileImage: this.uploadedProfilePicName
        ? this.uploadedProfilePicName
        : this.employeeDetails.profileImage,
      isCandidateFresher: false,
      // "acceptedTermsAndConditions": true //Will remove once remove from API
    };

// Check userType and add candidateExperience if userType is 'CAN'
// if (userType === 'CAND') {
//   userDetails.candidateExperience = candidateExperience;
// }
    try {
      await this.candidateSrv
        .createUserDetails(this.emailAddress, userDetails)
        .then(async (response) => {
          if (response) {
            this.addBankDetails();
          }
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async getWorkExperienceDetails() {
    try {
      await this.candidateSrv
        .getWorkExperience(this.emailAddress)
        .then(async (response) => {
          if (
            Array.isArray(response) &&
            response.length > 0 &&
            response[0].hasOwnProperty("SK")
          ) {
            // Assuming 'SK' is a property that indicates the response structure
            this.workExperienceDetailsList = response;
            this.workExperienceDetails = response[0];
            console.log(this.workExperienceDetails);
          }else{
            console.log(this.workExperienceDetails);
          }
          // this.spinner.hide();
          this.getBankDetails();
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async getBankDetails() {
    try {
      await this.empService
        .getBankDetails(this.emailAddress)
        .then(async (response) => {
          if (response) {
            this.bankDetails = response;
            this.spinner.hide();
          }
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }

  async addBankDetails() {
    let data = {
      upiIds: [
        {
          upiId: this.thirdStepData.upiId,
        },
      ],
      SK: this.bankDetails[0]?.SK,
      PK: this.bankDetails[0]?.PK,
      bankDetails: [
        {
          holderName: this.thirdStepData.holderName,
          accNumber: this.thirdStepData.accNumber,
          bankName: this.thirdStepData.bankName,
          accType: this.thirdStepData.accType,
          ifscCode: this.thirdStepData.ifscCode,
        },
      ],
    };
    try {
      await this.empService
        .createBankDetails(this.emailAddress, data)
        .then(async (response) => {
          if (response) {
            this.spinner.hide();
            // this.router.navigate(['/employee/edashboard']);
            this.modalopen();
            console.log(response);
          }
        });
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(["/"]);
      } else {
        this.spinner.hide();
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
  }
  modalopen() {
    this.successmessage = "Your profile has been updated successfully.";
    this.successtitle = "Congratulations!";
    this.openModal(ModalType.SUCCESS_MESSAGE);
  }

  continue() {
    this.router.navigate(["/employee/Dashboard"]);
    this.closeModal();
  }
  cancel() {
    this.router.navigate(["/employee/Dashboard"]);
    this.closeModal();
  }

  getSlicedValue(value: string): string {
    const parts = value?.split("#");
    if (parts && parts.length > 1) {
      return parts.length > 2 ? parts[2] : parts[1];
    }
    return "";
  }

  /**
   * Open modal.
   *
   * @param {ModalType} modalType
   * @param {string} [message = ""]
   * @param {string} [title = ""]
   * @returns {void}
   */
  openModal(
    modalType: ModalType,
    message: string = "",
    title: string = ""
  ): void {
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
