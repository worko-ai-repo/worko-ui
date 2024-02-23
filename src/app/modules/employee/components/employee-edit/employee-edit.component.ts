import { Component } from '@angular/core';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent {
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
  constructor(private spinner: NgxSpinnerService, private router: Router, private authService: AuthService, private empService: EmployeeProfileService, private candidateSrv: CandidateProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getEmployeeDetails();


  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }

  }
  nextStepThird(data: any) {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.secondStepData = data;
    this.employeeProfessionalData = data;
  }

  nextStepSecond(data: any) {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.firstStepData = data;
    this.employeePersonalData = data;
  }
  previousStep() {

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  previousStepSecond(data: any) {
    this.thirdStepData = data;
    this.employeeBankDetails = data;
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  // Get API //
  async getEmployeeDetails() {
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.employeeDetails = response[0];
        await this.getSocialProfile();

      }
    })
  }
  onSuccess(data: any) {
    this.thirdStepData = data;
    this.updateProfilePic();
    // this.updateWorkExperience();
  }
  async getSocialProfile() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.employeeSocial = response[0];

      }
      this.getWorkExperienceDetails();
    });
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
          profileFileMimeType: this.firstStepData.fileType
        }
        let docResult = await this.candidateSrv.uploadProfilePic(documentDetails);
        console.log(docResult);

        this.uploadedProfilePicName = docResult.cloudFileName;
        this.employeeDetails.profileImage = docResult.cloudFileName;
        this.uploadProfilePiconS3Bucket(docResult);

      } else {
        this.updateWorkExperience();
      }
    } catch (error) {
      console.log(error);
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

  async updateWorkExperience() {

    let workExperience =
      [{
        "companyName": this.secondStepData?.companyName,
        "companySK": this.secondStepData?.companySK,
        "emailId": this.secondStepData?.officialEmail,
        "designation": this.secondStepData?.designation,
        "department": this.secondStepData?.department,
        "SK": this.workExperienceDetails ? this.workExperienceDetails.SK : "",
        "PK": this.workExperienceDetails ? this.workExperienceDetails.PK : "",
        "experienceInMonths": this.secondStepData?.workingSince,
        "userType":"EMP",
      }
      ]
    await this.candidateSrv.createWorkExperience(this.emailAddress, workExperience).then(async (response) => {

      // if (response) {
      this.creatSocialProfile();
      // }
    })
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
      SK: this.employeeSocial?.SK,
      PK: this.employeeSocial?.PK
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
      "CV": this.employeeDetails.uploadCV,
      "about": this.firstStepData.about,
      "number": this.firstStepData.number,
      "noticePeriod": this.secondStepData.noticePeriod,
      "userType": this.employeeDetails.userType,
      "linkedinUrl": this.employeeDetails.linkedinUrl,
      "isEmailVerified": this.employeeDetails.isEmailVerified,
      "isNumberVerified": this.employeeDetails.isNumberVerified,
      "isSubscribed": this.employeeDetails.isSubscribed,
      "referralCount": this.employeeDetails.referralCount,
      "YOE": this.employeeDetails.YOE,
      "lastAccessedDash": this.employeeDetails.lastAccessedDash,
      "SK": this.employeeDetails?.SK,
      "PK": this.employeeDetails?.PK,
      "country":this.firstStepData?.country,
      "profileImage": this.uploadedProfilePicName ? this.uploadedProfilePicName : this.employeeDetails.profileImage,
      "acceptedTermsAndConditions": true //Will remove once remove from API
    
    }

    await this.candidateSrv.createUserDetails(this.emailAddress, userDetails).then(async (response) => {
      if (response) {
        this.addBankDetails();

      }
    })
  };

  async getWorkExperienceDetails() {
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 && response[0].hasOwnProperty('SK')) {
        // Assuming 'SK' is a property that indicates the response structure
        this.workExperienceDetails = response[0];

      }
      this.getBankDetails();
    })
  }

  async getBankDetails() {
    await this.empService.getBankDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.bankDetails = response;

      }
    })
  }






  async addBankDetails() {
    let data = {
      "upiIds": [
        {
          "upiId": this.thirdStepData.upiId
        }
      ],
      SK: this.bankDetails[0]?.SK,
      PK: this.bankDetails[0]?.PK,
      "bankDetails": [
        {
          "holderName": this.thirdStepData.holderName,
          "accNumber": this.thirdStepData.accNumber,
          "bankName": this.thirdStepData.bankName,
          "accType": this.thirdStepData.accType,
          "ifscCode": this.thirdStepData.ifscCode
        }
      ]
    };
    await this.empService.createBankDetails(this.emailAddress, data).then(async (response) => {
      if (response) {
        this.spinner.hide();
        this.router.navigate(['/employee/edashboard']);
        console.log(response);
      }
    })
  }
}
