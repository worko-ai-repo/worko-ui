import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],


})
export class PersonalInformationComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Input() candidateList: any;
  @Input() educationList: any;
  @Input() candidateSocial: any;
  emailAddress: any = "";
  candidateDetailsList: any = "";
  
  
  @Input() candidatePersonalDetails: any = {
    name: "",
    email: "",
    phoneNo: "",
    location: "",
    collegeName: "",
    collegeDegree: "",
    passingYear: "",
    collegeName1: "",
    collegeDegree1: "",
    passingYear1: "",
    about: "",
    socialLinkGithub: "",
    socialLinklinkdin: "",
    socialLinktwitter: "",



  };
  form = {

  }


  constructor(private candidateSrv: CandidateProfileService) { }

  ngOnInit(): void {
    console.log(this.candidateList);
    
  }

  ngOnChanges(): void {
    console.log(this.candidateList, "candidateList");
    console.log(this.educationList, "educationList");
    console.log(this.candidateSocial, "candidateSocial");
    this.getData();
    console.log( this.candidatePersonalDetails )
  }
  getData(){
    this.candidatePersonalDetails = {
      name: this.candidateList?.name,
      email: this.candidateList?.emailList?.primary,
      phoneNo: this.candidateList?.number,
      location: this.candidateList?.location,
      collegeName: this.educationList[0]?.collage,
      collegeDegree: this.educationList[0]?.degree,
      passingYear: this.educationList[0]?.passingYear,
      collegeName1:this.educationList[1]?.collage,
      collegeDegree1: this.educationList[1]?.degree,
      passingYear1: this.educationList[1]?.passingYear,
      about: this.candidateList?.about,
      socialLinkGithub: this.candidateSocial?.github,
      socialLinklinkdin:this.candidateSocial?.linkedin,
      socialLinktwitter: this.candidateSocial?.twitter,
    }
  }

  async createEducation(form: any): Promise<void> {
    // console.log(this.candidatePersonalDetails)
    this.nextStep.emit(this.candidatePersonalDetails)
  }
  // let data={
  //   "collegeDegree" : "",
  //   "passingYear":"",
  // }
  // this.candidateSrv.createEducation(this.emailAddress , data).then(async(response)=>{
  //   if(response){
  //     this.candidatePersonalDetails = this.candidateDetailsList
  //     
  //   }
  // })

  // async createEducation(form: any): Promise<void> {
  //   // Extract data from the form
  //   const educationData = {
  //     collegeName: form.collegeName,
  //     collegeDegree: form.collegeDegree,
  //     passingYear: form.passingYear,
  //   };


  //   const email = this.candidatePersonalDetails.email;
  //   try {
  //     const response = await this.candidateSrv.createEducation(email, educationData);
  //     console.log('API response:', response);

  //   } catch (error) {

  //     console.error('Error creating education:', error);
  //   }
  // }



  // async createCandidate(form: any): Promise<void> {
  //   try {
  //     this.setErrorMessage("");
  //     this.confirmationEmail = this.maskEmail(this.candidateForm.emailId);

  //     const { response, error } = await this.createUser(this.candidateForm);
  //     console.log(response);
  //     console.log(error);

  //     if (response) {
  //       try {
  //         let candidateData = {
  //           name: this.candidateForm.name,
  //           email: this.candidateForm.emailId,
  //           number: Number(this.candidateForm.phoneNumber),
  //           linkedinUrl: this.candidateForm.linkdinProfile,
  //           ECTC: Number(this.candidateForm.expectedCtc),
  //           YOE: Number(this.candidateForm.experience),
  //           userId: response.userId
  //         }
  //         this.authService.createCandidate(candidateData).then(async () => {
  //           try {
  //             if (response && response.userId && this.fileName) {

  //               let documentDetails = {
  //                 userId: this.userId,
  //                 resumeUserFileName: this.fileName,
  //                 resumeFileMimeType: this.fileType
  //               }
  //               let docResult = await this.authService.uploadCV(documentDetails);
  //               console.log(docResult);

  //               this.uploadedCvName = docResult.cloudFileName;
  //               this.uploadCVonS3Bucket(docResult);

  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         })
  //           .catch(error => {
  //             this.setErrorMessage(error.error?.errors.message);
  //             console.error('File upload error:', error);



  //           });


  //       } catch (error: any) {
  //         this.setErrorMessage(error.error?.errors.message);
  //         console.error('File upload error:', error);
  //       }


  //     }

  //     if (error && error.message) {
  //       this.errorMessage = error.message;
  //     }

  //   } catch (error) {
  //     console.log('Error signing up candidate createCandidate:', error);
  //   }


  // }

}
