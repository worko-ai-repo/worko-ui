import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-create-candidate-for-linkedin',
  templateUrl: './create-candidate-for-linkedin.component.html',
  styleUrls: ['./create-candidate-for-linkedin.component.scss']
})
export class CreateCandidateForLinkedinComponent {

  userEmail:any;
  userName:any;
  pictureUrl:any;
  fileToUpload: File | null = null;
  candidateForm = {
    name: '',
    emailId: '',
    password: '',
    candidateOtp: '',
    linkdinProfile: '',
    experience: '',
    expectedCtc: '',
    phoneNumber: '',
    confirmPassword: '',
    checkboxChecked: false,
    acceptedTermsAndConditions: false


  }
form: any;
userId: string = "";
fileName: string = "";
fileType: string = "";
uploadedCvName: string = "";
errorMessage: string = "";
  fileErr: string = "";
  isBlinking = true;
  blinkTimer: any; //timer reference
  currentWordIndex = 0;
  CandidateWords = ["Referral", "Career Guidance", "Interview Mentorship", "Mock Interview"];
  currentWord = '';
  constructor( private spinner: NgxSpinnerService, private authService: AuthService, private storage: StorageService,private router: Router,private amplify: CognitoService) {}
  ngOnInit(): void {
this.getCandidateData()
this.blinkAndChangeWord()

  }
  async getCandidateData(){
    const {
      tokens,
     
      userSub
  } = await fetchAuthSession();
  console.log(tokens)
     this.userEmail=tokens?.idToken?.payload['email']?.toString()
     this.userName=tokens?.idToken?.payload['name']?.toString()
     this.pictureUrl=tokens?.idToken?.payload['picture']
 console.log(this.userEmail,this.userName,this.pictureUrl)

 const {
  username,
  userId: id
} = await getCurrentUser();
    this.userId=id
    console.log(id)

   //this.storage.set("useremail", this.userEmail);

  }

  @ViewChild('nameInput') nameInput!: NgModel;
  validateName() {
    if (!this.userName) {
      this.nameInput.control.setErrors({ 'required': true });
    }
  }
  blinkAndChangeWord() {
    const words = this.CandidateWords;
    this.currentWord = words[this.currentWordIndex];
    this.isBlinking = false;

    this.blinkTimer = setTimeout(() => {
      this.isBlinking = true;
      this.currentWordIndex = (this.currentWordIndex + 1) % words.length;
      this.blinkAndChangeWord();
    }, 3000); // timeout based on our animation duration
  }
  clearBlinkTimer() {
    if (this.blinkTimer) {
      clearTimeout(this.blinkTimer);
    }
  }

  ngOnDestroy() {
    this.clearBlinkTimer();
  }

  async createCandidate(form: any): Promise<void> {
    this.spinner.show();
    
  
          let candidateData = {
            name: this.userName,
            email: this.userEmail,
            number: this.candidateForm.phoneNumber,
            linkedinUrl: this.candidateForm.linkdinProfile,
            ECTC: Number(this.candidateForm.expectedCtc),
            YOE: Number(this.candidateForm.experience),
            userId: this.userId,
            acceptedTermsAndConditions: this.candidateForm.acceptedTermsAndConditions

          }
          this.authService.createCandidate(candidateData).then(async () => {
            try {
              if (this.userId && this.fileName) {

                let documentDetails = {
                  userId: this.userId,
                  resumeUserFileName: this.fileName,
                  resumeFileMimeType: this.fileType
                }
                let docResult = await this.authService.uploadCV(documentDetails);
                console.log(docResult);

                this.uploadedCvName = docResult.cloudFileName;
                this.uploadCVonS3Bucket(docResult);

              }
             
            } catch (error) {
             // this.spinner.hide();
              console.log(error);
            }
          })
          


      }




  uploadCVonS3Bucket(docResult: any) {
    debugger
    try {
      this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {
          console.log('File uploaded successfully.');
          try {
            let a = await this.authService.linkResumewithUser(this.userEmail, this.uploadedCvName);
           
            //this.spinner.hide();
          } catch (error: any) {
            debugger;
            if (error && error.error.message) {
               this.errorMessage = error.error.message;
             // this.spinner.hide();
              //this.setErrorMessage('File Link error linkResumewithUser:- ' + error.error.message);
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
    this.storage.set("useremail", this.userEmail);
          console.log(this.userEmail);
          this.router.navigate(['/candidate/dashboard']);
    
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files) {
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file: File = files[0];

        // Check if the file type is PDF
        if (file.type === 'application/pdf') {
          // Process the PDF file as needed
          this.fileErr = "";
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          console.log('Selected PDF file:', file);
        } else {
          // Display an error for invalid file type
          console.error('Invalid file type. Please upload a PDF file.');
          this.fileErr = "Invalid file type. Please upload a PDF file."
          this.fileName = "";
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
        }
      }
    }
  }

  


}
