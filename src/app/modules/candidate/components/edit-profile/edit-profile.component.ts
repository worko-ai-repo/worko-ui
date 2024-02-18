import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import * as data from 'src/assets/data/data.json';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { error } from 'jquery';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
 
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


  constructor(private spinner: NgxSpinnerService, private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
    console.log(this.firstStepData)
    this.emailAddress = this.storage.get("useremail");
    this.getCandidateDetails();
  }

  // ngOnChanges(): void {
  //   debugger;
  //   console.log(this.candidateList, "candidateList");
  //    console.log(this.workExperienceDetails, "workExperienceDetails");
  //   console.log(this.certificationList, "certificationList");
  //   console.log( this.candidateProfessionalDetails )
  // }

  // post //

  async updateWorkExperience() {

    let workExperience =
      [{
        "companyName": this.secondStepData?.companyName,
        "companySK": this.secondStepData?.companySK,
        "emailId": this.secondStepData?.officialEmail,
        "designation": this.secondStepData?.designation,
        "department": this.secondStepData?.department,
        "SK": this.workExperienceDetails ? this.workExperienceDetails.SK : "",
        "PK": this.workExperienceDetails ? this.workExperienceDetails.PK : ""
      }
      ]
    await this.candidateSrv.createWorkExperience(this.emailAddress, workExperience).then(async (response) => {

      // if (response) {
      this.createEducationDetails();
      // }
    })
  }

  async createEducationDetails() {
    let data =
      [
        {
          "passingYear": this.firstStepData.passingYear,
          "collage": this.firstStepData.collegeName,
          "degree": this.firstStepData.collegeDegree,
          "SK": this.firstStepData?.SK,
          "PK": this.firstStepData?.PK,
        },

        {
          "passingYear": this.firstStepData.passingYear1,
          "collage": this.firstStepData.collegeName1,
          "degree": this.firstStepData.collegeDegree1,
          "SK": this.firstStepData?.SK1,
          "PK": this.firstStepData?.PK1,
        }
      ];

    await this.candidateSrv.createEducation(this.emailAddress, data).then(async (response) => {
      // if (response) {
      this.createSkills();
      // }
    })

  };

  async createSkills() {
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
  }

  async createAchievements() {
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

  }
  async creatSocialProfile() {
    var twitterArray = this.firstStepData.socialLinktwitter;
    var linkedinArray = this.firstStepData.socialLinklinkdin;
    var githubArray = this.firstStepData.socialLinkGithub;
    // Check if twitterArray is an array
    if (Array.isArray(twitterArray)) {
      console.log('twitterArray is already an array');
    } else {
      console.log('twitterArray is not an array');
      twitterArray = [this.firstStepData.socialLinktwitter];
    }

      // Check if twitterArray is an array
      if (Array.isArray(linkedinArray)) {
        console.log('twitterArray is already an array');
      } else {
        console.log('twitterArray is not an array');
        linkedinArray = [this.firstStepData.socialLinklinkdin];
      }

      if (Array.isArray(githubArray)) {
        console.log('twitterArray is already an array');
      } else {
        console.log('twitterArray is not an array');
        githubArray = [this.firstStepData.socialLinkGithub];
      }
    let socialProfile =
    {
      twitter: twitterArray,
      github: githubArray,
      linkedin: linkedinArray,
      SK: this.firstStepData?.socialSk,
      PK: this.firstStepData?.socialPk
    }
    await this.candidateSrv.createUserProfile(this.emailAddress, socialProfile).then(async (response) => {
      // if (response) {
      this.createUserDetails();
      // }
    })
  }

  async createUserDetails() {
    let userDetails: any = {
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
      "number": this.firstStepData.phoneNo,
      "noticePeriod": this.secondStepData.noticePeriod,
      "userType": this.candidateList.userType,
      "linkedinUrl": this.candidateList.linkedinUrl,
      "isEmailVerified": this.candidateList.isEmailVerified,
      "isNumberVerified": this.candidateList.isNumberVerified,
      "isSubscribed": this.candidateList.isSubscribed,
      "referralCount": this.candidateList.referralCount,
      "YOE": this.candidateList.YOE,
      "lastAccessedDash": this.candidateList.lastAccessedDash,
      "SK": this.candidateList?.SK,
      "PK": this.candidateList?.PK,
      "profileImage": this.uploadedProfilePicName ? this.uploadedProfilePicName : this.candidateList.profileImage
    }

    await this.candidateSrv.createUserDetails(this.emailAddress, userDetails).then(async (response) => {
      if (response) {
        // this.createUserDetails();
        this.spinner.hide();
        this.router.navigate(['/candidate/cdashboard']);
      }
    })
  };

  // get//


  async getCandidateDetails() {
    this.spinner.show();
    try {
      const response = await this.candidateSrv.getUserDetails(this.emailAddress);
      if (response) {
        this.candidateList = response[0];
        await this.getEducationDetails();
      }
    } catch (error:any) {
      if (error.status === 401) {
        this.spinner.hide();
        this.router.navigate(['/']);
        // Handle unauthorized or forbidden error
        console.error('Unauthorized or Forbidden:', error);
        // For example, you can redirect the user to a login page or display an error message
      } else {
        // Handle other errors
        console.error('An error occurred:', error);
        // For example, display an error message to the user
      }
    }
  }

  async getEducationDetails() {
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
      if (response) {
        this.educationList = response;
        this.educationDetails = this.educationList[0];
        this.getSocialProfile();
      }
    })
  }

  async getSocialProfile() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateSocial = response[0];
        this.userCertifications();
      }
    });
  }

  async userCertifications() {
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0) {
        this.certificationList = response[0];
        this.coreSkillsLists = response[0].coreSkills;
        this.softSkillsLists = response[0].softSkills;

      }
      this.getWorkExperienceDetails();
    })
  }

  async getWorkExperienceDetails() {
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 && response[0].hasOwnProperty('SK')) {
        // Assuming 'SK' is a property that indicates the response structure
        this.workExperienceDetails = response[0];

      }
      this.getAchievements();
    })
  }


  async getAchievements() {
    await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0) {
        this.achievements = response[0];
        this.achievementsList = response[0].achievements;
        this.spinner.hide();
      }
    })
  }






  nextStep() {
    // console.log(this.candidateList)
    // console.log(this.candidateProfessionalDetails)
    // console.log(this.firstStepData)
    // this.candidateList =  this.firstStepData;
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    // console.log(this.candidatePersonalDetails)
    // console.log(this.candidateProfessionalDetails)
    // console.log(this.firstStepData)
    this.candidatePersonalDetails = this.firstStepData;
    this.candidateProfessionalDetails = this.secondStepData;
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  previousStepSecond(data: any) {
    this.thirdStepData = data;
    this.candidateUploadDetails = data;
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  previousStepFirst(data: any) {
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
    this.thirdStepData = data;
    this.uploadUserCV();
  }

  getCandidateListData(data: any) {
    // console.log(this.candidateList)
    // console.log(this.candidateProfessionalDetails)
    this.firstStepData = data;
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  getProfessionalData(data: any) {
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
        console.log(docResult);

        this.uploadedCvName = docResult.cloudFileName;
        this.candidatePersonalDetails.CV = docResult.cloudFileName;
        this.uploadCVonS3Bucket(docResult);

      } else {
        this.updateProfilePic();
      }
    } catch (error) {
      console.log(error);
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
        console.log(docResult);

        this.uploadedProfilePicName = docResult.cloudFileName;
        this.candidatePersonalDetails.profileImage = docResult.cloudFileName;
        this.uploadProfilePiconS3Bucket(docResult);

      } else {
        this.updateWorkExperience();
      }
    } catch (error) {
      console.log(error);
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
            } else {
              await this.updateWorkExperience();
            }


          } catch (error: any) {

            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
              // this.setErrorMessage('File Link error linkResumewithUser:- '+ error.error.message);
            }
            console.error('File Link error linkResumewithUser:', error);
          }

        })
        .catch(error => {

          console.error('File upload error:', error);


        });

    } catch (error) {
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

            await this.updateWorkExperience();

          } catch (error: any) {

            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
              // this.setErrorMessage('File Link error linkResumewithUser:- '+ error.error.message);
            }
            console.error('File Link error linkResumewithUser:', error);
          }

        })
        .catch(error => {

          console.error('File upload error:', error);


        });

    } catch (error) {
      console.log(error)
    }
  }

}
