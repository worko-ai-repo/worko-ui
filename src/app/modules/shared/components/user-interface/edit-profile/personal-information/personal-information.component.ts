import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
  
  
})
export class PersonalInformationComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  emailAddress:any="";
  candidateDetailsList:any="";
  @Input() candidatePersonalDetails:any={
    name:"",
    email:"",
    phoneNo:"",
    location:"",
    collegeName:"",
    collegeDegree:"",
    passingYear:"",
    collegeName1:"",
    collegeDegree1:"",
    passingYear1:"",
    about:"",
    socialLinkGithub:"",
    socialLinklinkdin:"",
    socialLinktwitter:"",



  };
  form ={

  }
  

constructor( private candidateSrv : CandidateProfileService){}

ngOnInit(): void {
    
}

async createEducation(form:any): Promise<void>{
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
//             this.setErrorMessage(error.error?.errors[0].message);
//             console.error('File upload error:', error);



//           });


//       } catch (error: any) {
//         this.setErrorMessage(error.error?.errors[0].message);
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
