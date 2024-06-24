import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
// import * as data from 'src/assets/data/data.json';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { error } from 'jquery';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { CognitoService } from 'src/app/modules/services/cognito.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {


  @ViewChild(ModalComponent) modal!: ModalComponent;

  candidateList: any;
  educationList: any = "";
  emailAddress: string = "";
  candidateDetails: any = {};
  educationDetails: any = {};
  achievementsList: any = "";
  candidateSocial: any = {};
  certificationList: any;
  coreSkillsLists: any;
  softSkillsLists: any;
  userDescription: string = "";
  currentStep: number = 1;
  // emailAddress:any="";
  docResult: any = {};
  candidatePersonalDetails: any = {};
  candidateProfessionalDetails: any = {};
  candidateUploadDetails: any = {};
  workExperienceDetails: any;
  firstStepData: any;
  secondStepData: any;
  thirdStepData: any;
  achievements: any;
  uploadedCvName: string = "";
  userId: string | undefined;
  uploadedProfilePicName: string = "";

  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  details: any;
  constructor(private spinner: NgxSpinnerService,private cognitoService: CognitoService, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getCandidateDetails();
    // this.openModal(this.modalType.MESSAGE, "Title", "Conteny");
  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    if (parts && parts.length > 1) {
      return parts.length > 2 ? parts[2] : parts[1];
    }
    return '';
  }


  // post //

  async updateWorkExperience() {
    let companyId = this.getSlicedValue(this.secondStepData?.companySK);
    try {
      let workExperience =
        [{
          "companyName": this.secondStepData?.companyName,
          "companyId": companyId,
          "designation": this.secondStepData?.designation,
          "department": this.secondStepData?.department,
          "SK": this.workExperienceDetails ? this.workExperienceDetails.SK : "",
          "PK": this.workExperienceDetails ? this.workExperienceDetails.PK : "",
          "userType": "CAND",
          "isCurrent": this.secondStepData?.isCurrent ? this.secondStepData?.isCurrent : true
        }
        ]

      await this.candidateSrv.createWorkExperience(this.emailAddress, workExperience).then(async (response) => {

        this.spinner.hide();
        this.modelOpen();
        // this.router.navigate(['/candidate/dashboard']);

        //this.createEducationDetails();
        console.log(this.candidatePersonalDetails)

      })
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  }



  async createEducationDetails() {
    // let data =
    //   [
    //     {
    //       "passingYear": this.firstStepData.passingYear,
    //       "collage": this.firstStepData.collegeName,
    //       "degree": this.firstStepData.collegeDegree,
    //       "SK": this.firstStepData?.SK,
    //       "PK": this.firstStepData?.PK,
    //     },

    //     {
    //       "passingYear": this.firstStepData.passingYear1,
    //       "collage": this.firstStepData.collegeName1,
    //       "degree": this.firstStepData.collegeDegree1,
    //       "SK": this.firstStepData?.SK1,
    //       "PK": this.firstStepData?.PK1,
    //     }
    //   ];
    try {
      if (this.firstStepData.collegeData) {
        console.log(this.firstStepData.collegeData)
        await this.candidateSrv.createEducation(this.emailAddress, this.firstStepData.collegeData).then(async (response) => {
          this.createSkills();
        })

      }
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
    console.log(this.firstStepData.collegeData)

  };

  async createSkills() {
    //console.log(this.secondStepData.softSkills,this.certificationList?.SK,this.certificationList.pk)
    try {
      let skills =
      {
        "softSkills": this.secondStepData.softSkills,
        "certifications": this.secondStepData.certificationNames,
        "coreSkills": this.secondStepData.coreSkillList,
        "SK": this.certificationList?.SK,
        "PK": this.certificationList?.PK
      }
      await this.candidateSrv.createUserSkills(this.emailAddress, skills).then(async (response) => {
        // if (response) {
        this.createAchievements();
        // }
      })
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  }

  async createAchievements() {
    try {
      if (this.secondStepData.achievements) {

        let userAchievements =
        {
          "achievements": this.secondStepData.achievements,
          "SK": this.achievements ? this.achievements?.SK : "",
          "PK": this.achievements ? this.achievements?.PK : ""
        }
        await this.candidateSrv.createAchievments(this.emailAddress, userAchievements).then(async (response) => {
          // if (response) {
          this.creatSocialProfile();
          // this.createUserDetails();
          // }
        })
      } else {
        this.creatSocialProfile();
      }
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }

  }
  async creatSocialProfile() {
    var twitterArray: string[] = this.firstStepData.socialLinktwitter || [];
    var linkedinArray: string[] = this.firstStepData.socialLinklinkdin || [];
    var githubArray: string[] = this.firstStepData.socialLinkGithub || [];

    // Check if twitterArray is an array
    if (twitterArray.length > 2) {
      console.log('twitterArray is already an array');
      twitterArray = [this.firstStepData.socialLinktwitter];
    } else if (twitterArray.length == 1) {
      console.log('twitterArray is already an array');
      twitterArray = this.firstStepData.socialLinktwitter;
    } else {
      console.log('twitterArray is not an array');
      twitterArray = [];
    }

    // Check if twitterArray is an array
    console.log(linkedinArray.length)
    if (linkedinArray.length > 2) {
      linkedinArray = [this.firstStepData.socialLinklinkdin];
      console.log('linkedinArray is already an array');
    } else if (linkedinArray.length == 1) {
      linkedinArray = this.firstStepData.socialLinklinkdin;
    } else {
      console.log('linkedinArray is not an array');
      linkedinArray = [];


    }
    console.log(githubArray.length)
    if (githubArray.length > 2) {
      console.log('githubArray is already an array');

      githubArray = [this.firstStepData.socialLinkGithub];
    } else if (githubArray.length == 1) {
      githubArray = this.firstStepData.socialLinkGithub;
    } else {
      console.log('githubArray is not an array');
      githubArray = [];
    }
    let socialProfile =
    {
      twitter: twitterArray,
      github: githubArray,
      linkedin: linkedinArray,
      SK: this.firstStepData?.socialSk,
      PK: this.firstStepData?.socialPk
    }
    console.log(socialProfile)
    try {
      await this.candidateSrv.createUserProfile(this.emailAddress, socialProfile).then(async (response) => {
        if (!this.secondStepData.isCandidateFresher) {
          // this.createUserDetails();
         // this.updateWorkExperience();
         this.spinner.hide();
         this.modelOpen();
        }
        else {
          //this.router.navigate(['/candidate/dashboard']);
          this.spinner.hide();
          this.modelOpen();

        }
      })
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  }
  modelOpen() {

    this.successmessage = "Your profile has been updated successfully.";
    this.successtitle = "Congratulations!";
    this.openModal(ModalType.SUCCESS_MESSAGE)
  }



  continue() {

    this.router.navigate(['/candidate/dashboard']);
    this.closeModal();
    //window.location.reload();

  }
  cancel() {
    this.router.navigate(['/candidate/dashboard']);
    this.closeModal();
  }

  async createUserDetails() {
    console.log(this.secondStepData, "this.secondStepD")
    
    try {
      let userDetails: any = {
        
        // "candidateExperience":{
        //   "department":this.secondStepData.department??"",
        //   "companyName":this.secondStepData.companyName??"",
        //   "designation":this.secondStepData.designation??"",
        // },
        "ECTC": this.secondStepData.ectc,
        "location": this.firstStepData.location,
        "coverLetter": this.thirdStepData.coverLetter,
        "name": this.firstStepData.name,
        "CTC": this.secondStepData.ctc,
        "emailList": {
          "primary": this.firstStepData.email,
        },
        "CV": this.candidateList.uploadCV,
        "about": this.firstStepData.about,
        "number": "+91"+this.firstStepData.phoneNo,
        "noticePeriod": this.secondStepData.noticePeriod,
        "userType": this.candidateList.userType,
        "linkedinUrl": this.candidateList.linkedinUrl,
        "isEmailVerified": this.candidateList.isEmailVerified,
        "isNumberVerified": this.candidateList.isNumberVerified,
        "isSubscribed": this.candidateList.isSubscribed,
        "referralCount": this.candidateList.referralCount,
        "YOE": this.secondStepData.yoe,
        "lastAccessedDash": this.candidateList.lastAccessedDash,
        "SK": this.candidateList?.SK,
        "PK": this.candidateList?.PK,
        "country": this.firstStepData?.country,
        "profileImage": this.uploadedProfilePicName ? this.uploadedProfilePicName : this.candidateList.profileImage,
        "isCandidateFresher": this.secondStepData.isCandidateFresher,
        // ...(this.secondStepData.isCandidateFresher === false && {
        //   "candidateExperience": {
        //     "department": this.secondStepData.department ?? "",
        //     "companyName": this.secondStepData.companyName ?? "",
        //     "designation": this.secondStepData.designation ?? "",
        //   }
        // })
        // "acceptedTermsAndConditions": true //Will remove once remove from API
      }
      if (!this.secondStepData.isCandidateFresher) {
        userDetails.candidateExperience = {
          "department": this.secondStepData.department ?? "",
          "companyName": this.secondStepData.companyName ?? "",
          "designation": this.secondStepData.designation ?? ""
        };
      }

      await this.candidateSrv.createUserDetails(this.emailAddress, userDetails).then(async (response) => {
        if (response) {
          // this.createUserDetails();
          this.createEducationDetails();
          this.spinner.hide();

        }
      })
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  };

  // get//


  async getCandidateDetails() {
    try {
      this.spinner.show();
      const response = await this.candidateSrv.getUserDetails(this.emailAddress);
      if (response) {
        this.candidateList = response[0];

        await this.getEducationDetails();
      }
      this.spinner.hide(); // Hide the spinner after successful API call
    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if(error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      
        // Handle unauthorized or forbidden error

        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }


  async getEducationDetails() {
    try {
      await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
        if (response) {
          this.educationList = response;
          this.educationDetails = this.educationList[0];
          this.getSocialProfile();
        }
      })
    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
        // Handle unauthorized or forbidden error

        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }

  async getSocialProfile() {
    try {
      await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
        if (response) {
          this.candidateSocial = response[0];
          this.userCertifications();
        }
      });
    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
        // Handle unauthorized or forbidden error

        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }

  async userCertifications() {
    try {
      await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.certificationList = response[0];
          this.coreSkillsLists = response[0].coreSkills;
          this.softSkillsLists = response[0].softSkills;

        }
       // this.getWorkExperienceDetails();
       this.getWorkExperienceDetails();
      })

    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
        // Handle unauthorized or forbidden error

        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }

  async getWorkExperienceDetails() {
    try {
      await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
        if (Array.isArray(response) && response.length > 0 && response[0].hasOwnProperty('SK')) {
          // Assuming 'SK' is a property that indicates the response structure
          this.workExperienceDetails = response[0];

        }
        this.getAchievements();
      })
    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
        // Handle unauthorized or forbidden error

        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }


  async getAchievements() {
    try {
      await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.achievements = response[0];
          this.achievementsList = response[0].achievements;
          this.spinner.hide();

        }
      })
    } catch (error: any) {
      this.spinner.hide(); // Hide the spinner in case of error as well
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
        // Handle unauthorized or forbidden error

        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }
  nextStepSecond(data: any) {
    // 
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.firstStepData = data;
    this.candidatePersonalDetails = data;
  }


  nextStep() {
    this.candidatePersonalDetails = this.firstStepData;
    if (this.currentStep < 3) {
      this.currentStep++;

    }
  }

  previousStep() {
    // 
    this.candidatePersonalDetails = this.firstStepData;
    this.candidateProfessionalDetails = this.secondStepData;


    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  previousStepSecond(data: any) {
    //
    this.thirdStepData = data;
    this.candidateUploadDetails = data;
    this.candidatePersonalDetails = this.firstStepData;
    this.candidateProfessionalDetails = this.secondStepData;

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  previousStepFirst(data: any) {
    //
    this.secondStepData = data;
    this.candidateProfessionalDetails = data;
    this.candidatePersonalDetails = this.firstStepData;
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  //When uer click on "Complete" on 3rd step
  onSuccess(data: any) {
    this.spinner.show();
    //
    this.thirdStepData = data;
    //this.modelOpen();
    this.uploadUserCV();


  }

  getCandidateListData(data: any) {
    //
    this.firstStepData = data;
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  getProfessionalData(data: any) {
    //
    this.secondStepData = data;
    this.candidateProfessionalDetails = data;
    this.candidatePersonalDetails = this.firstStepData;
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  async uploadUserCV(): Promise<void> {
    try {
      // if (this.userId && this.thirdStepData.fileType && this.thirdStepData.fileName) {
      if (this.thirdStepData.fileType && this.thirdStepData.fileName) {
        let documentDetails = {
          // userId: this.userId,
          userId: this.candidateList.SK.split("#")[1],
          resumeUserFileName: this.thirdStepData.fileName,
          resumeFileMimeType: this.thirdStepData.fileType
        }
        let docResult = await this.authService.uploadCV(documentDetails);

        this.uploadedCvName = docResult.cloudFileName;
        this.candidatePersonalDetails.CV = docResult.cloudFileName;
        this.uploadCVonS3Bucket(docResult);




      } else {
        this.updateProfilePic();
      }
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }

  }

  async updateProfilePic(): Promise<void> {
    try {
      // if (this.userId && this.thirdStepData.fileType && this.thirdStepData.fileName) {
      if (this.firstStepData.fileType && this.firstStepData.fileName) {
        let documentDetails = {
          // userId: this.userId,
          userId: this.candidateList.SK.split("#")[1],
          profileUserFileName: this.firstStepData.fileName,
          profileFileMimeType: this.firstStepData.fileType
        }
        let docResult = await this.candidateSrv.uploadProfilePic(documentDetails);


        this.uploadedProfilePicName = docResult.cloudFileName;
        this.candidatePersonalDetails.profileImage = docResult.cloudFileName;
        this.uploadProfilePiconS3Bucket(docResult);

      }
      else {
        // this.updateWorkExperience();
        this.createUserDetails();
      }
    } catch (error: any) {
      if (error.status==404 || error.status==401){
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  }


  uploadCVonS3Bucket(docResult: any) {
    
    try {
      this.authService.uploadFileOnS3Bucket(this.thirdStepData.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {

          console.log('File uploaded successfully.');




          try {
            let a = await this.authService.linkResumewithUser(this.emailAddress, this.uploadedCvName);
            if (this.firstStepData.fileType && this.firstStepData.fileName) {
              this.updateProfilePic();
            }
            else {
              // await this.updateWorkExperience();
              await this.createUserDetails();
            }


          } catch (error: any) {

            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
              // this.setErrorMessage('File Link error linkResumewithUser:- '+ error.error.message);
              this.spinner.hide();
              this.successmessage = "Something went wrong. Please try again after sometime"
              this.successtitle = "Error"
              this.openModal(ModalType.SUCCESS_MESSAGE)
            }
            this.spinner.hide();
            this.successmessage = "Something went wrong. Please try again after sometime"
            this.successtitle = "Error"
            this.openModal(ModalType.SUCCESS_MESSAGE)
            console.error('File Link error linkResumewithUser:', error);
          }

        })
        .catch(error => {
          this.spinner.hide();
          this.successmessage = "Something went wrong. Please try again after sometime"
          this.successtitle = "Error"
          this.openModal(ModalType.SUCCESS_MESSAGE)
          console.error('File upload error:', error);


        }
        );

    } catch (error) {
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
      console.log(error)
    }

  }

  uploadProfilePiconS3Bucket(docResult: any) {
    try {
      this.authService.uploadFileOnS3Bucket(this.firstStepData.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {

          console.log('File uploaded successfully.');
          try {
            // let a = await this.authService.linkResumewithUser(this.emailAddress, this.uploadedProfilePicName);

            //await this.updateWorkExperience();
            await this.createUserDetails();
          } catch (error: any) {

            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
              // this.setErrorMessage('File Link error linkResumewithUser:- '+ error.error.message);
              this.spinner.hide();
              this.successmessage = "Something went wrong. Please try again after sometime"
              this.successtitle = "Error"
              this.openModal(ModalType.SUCCESS_MESSAGE)
            }
            this.spinner.hide();
            this.successmessage = "Something went wrong. Please try again after sometime"
            this.successtitle = "Error"
            this.openModal(ModalType.SUCCESS_MESSAGE)
            console.error('File Link error linkResumewithUser:', error);
          }

        })
        .catch(error => {
          this.spinner.hide();
          this.successmessage = "Something went wrong. Please try again after sometime"
          this.successtitle = "Error"
          this.openModal(ModalType.SUCCESS_MESSAGE)

          console.error('File upload error:', error);


        });

    } catch (error) {
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
      console.log(error)
    }
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


