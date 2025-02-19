import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';


import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-create-candidate-for-linkedin',
  templateUrl: './create-candidate-for-linkedin.component.html',
  styleUrls: ['./create-candidate-for-linkedin.component.scss']
})
export class CreateCandidateForLinkedinComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  userEmail: any;
  userName: any;
  pictureUrl: any;
  fileToUpload: File | null = null;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  candidateForm = {
    name: '',
    emailId: '',
    password: '',
    candidateOtp: '',
    // linkdinProfile: '',
    // experience: '',
    // expectedCtc: '',
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
  successmessage: string = "";
  successtitle: string = "";
  letter: any;
  groupType: any;
  constructor(private spinner: NgxSpinnerService, private candidateSrv: CandidateProfileService, private authService: AuthService, private storage: StorageService, private router: Router, private cognitoService: CognitoService) { }
  ngOnInit(): void {
    this.getCandidateData()
    this.blinkAndChangeWord()

  }
  async getCandidateData() {

    const {
      tokens,

      userSub
    } = await fetchAuthSession();

    this.userEmail = tokens?.idToken?.payload['email']?.toString().toLowerCase()
    this.userName = tokens?.idToken?.payload['name']?.toString()
    this.pictureUrl = tokens?.idToken?.payload['picture']
    this.groupType = tokens?.idToken?.payload['cognito:groups']

    if (Array.isArray(this.groupType) && this.groupType.includes('admin')) {
      this.storage.set('userType', 'Admin');
    }

    const {
      username,
      userId: id
    } = await getCurrentUser();
    this.userId = id


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
    try {

      let candidateData = {
        name: this.userName,
        email: this.userEmail,
        number: "+91" + this.candidateForm.phoneNumber,
        // linkedinUrl: this.candidateForm.linkdinProfile,
        // ECTC: Number(this.candidateForm.expectedCtc),
        // YOE: Number(this.candidateForm.experience),
        userId: this.userId,
        acceptedTermsAndConditions: this.candidateForm.acceptedTermsAndConditions

      }

      let response = await this.authService.createCandidate(candidateData)

      try {
        if (this.userId && this.fileName && response) {

          let documentDetails = {
            userId: this.userId,
            resumeUserFileName: this.fileName,
            resumeFileMimeType: this.fileType
          }
          let docResult = await this.authService.uploadCV(documentDetails);

          this.uploadedCvName = docResult.cloudFileName;
          this.uploadCVonS3Bucket(docResult);

        }

      } catch (error) {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        //console.log(error);

      }


    } catch (error: any) {
      this.spinner.hide();
      if (error.status == 409) {
        this.successmessage = "It looks like you already have an account with us.  Please Sign In with Linkedin to continue."
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      } else if (error.status == 401) {
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
      this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {
          // console.log('File uploaded successfully.');
          try {
            let a = await this.authService.linkResumewithUser(this.userEmail, this.uploadedCvName);
            this.otpVerification(this.userEmail)
            // this.candidateSrv.getUserDetails(this.userEmail)
          } catch (error: any) {
            ;
            if (error && error.error.message) {
              this.errorMessage = error.error.message;
              // this.spinner.hide();
              //this.setErrorMessage('File Link error linkResumewithUser:- ' + error.error.message);
              this.spinner.hide();
              this.successmessage = "Something went wrong. Please try again after sometime"
              this.successtitle = "Error"
              this.openModal(ModalType.SUCCESS_MESSAGE)
            }
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
      // console.log(error)
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }


  }

  //To make isVerified Flag as true
  otpVerification(emailId: string): void {

    this.authService.otpVerification(emailId)
      .then(response => {

        this.storage.set("useremail", this.userEmail);
        this.storage.set("isLinkedinUser", 'true');
        const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
        if (isCompanyListingRoute) {
          // this.userName = this.storage.get('userName');
          // console.log(this.userName);
          // this.storage.set("useremail", this.userEmail);

          //this.letter = this.userName.charAt(0).toUpperCase();

          // Redirect to the company listing page
          // this.router.navigate(['/companies']);

          //redirect to dynamic routes
          const dynamicRoutes = this.storage.get('dynamicRoute')
          let decodedRoute = decodeURIComponent(dynamicRoutes); // Decode the route

          // Check if applyJob was set before login
          const applyJob = this.storage.get('applyJobAfterLogin'); // Retrieve flag
          if (applyJob) {
            this.storage.remove('applyJobAfterLogin'); // Clearing it after use

            // Append applyJob=true properly
            const url = new URL(decodedRoute, window.location.origin); // Creating URL object
            url.searchParams.set('applyJob', 'true'); // Adding query param

            decodedRoute = url.pathname + url.search; // Getting clean path here with params
          }
          // Navigate to the dynamic route with query param
          this.router.navigateByUrl(decodedRoute);

        } else if (this.groupType.includes('admin')) {
          this.router.navigate(['/switcher']);

        } else {
          this.router.navigate(['/candidate/dashboard']);
        }
        this.spinner.hide();


      })
      .catch(error => {
        console.error('OTP verification failed:', error);
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      });
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
          //  console.log('Selected PDF file:', file);
        } else {
          // Display an error for invalid file type
          console.error('Invalid file type. Please upload a PDF file.');
          this.fileErr = "Invalid file type. Please upload a PDF file."
          this.fileName = "";
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
          this.spinner.hide();

        }
      }
    }
  }
  cancel() {
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
    this.modal.cancel();
  }


}



