import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { ModalComponent } from '../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { CountryCodes } from 'src/app/modules/shared/data/country.data';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],


})
export class PersonalInformationComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Output() nextStep = new EventEmitter<void>();
  @Input() candidateList: any;
  @Input() educationList: any;
  @Input() candidateSocial: any;
  @Output() onSuccess = new EventEmitter<void>();


  maxyear=new Date().getFullYear().toString();
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  emailAddress: any = "";
  candidateDetailsList: any = "";
  // profilePicUrl: string = "/assets/public/candidate-img.png";
  picErrorMessage: string = "";
  @Input() candidatePersonalDetails: any = {
    name: "",
    email: "",
    phoneNo: "",
    location: "",
    collegeName: "",
    collegeDegree: "",
    passingYear: "",
    collegeData : [{
      collage: "",
      degree: "",
      passingYear: ""
    }],
    collegeName1: "",
    collegeDegree1: "",
    passingYear1: "",
    about: "",
    socialLinkGithub: "",
    socialLinklinkdin: "",
    socialLinktwitter: "",
    socialSk: "",
    socialPk: "",
    fileName: "",
    fileToUpload: "",
    fileType: "",
    profilePicUrl: "/assets/public/candidate-img.png"


  };

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  form = {

  }

  countryCodes: any = CountryCodes;
  savedValues!: any[];
 
  constructor(private candidateSrv: CandidateProfileService) {
   
   }

  ngOnInit(): void {
    console.log(this.candidateList);

  }

  ngOnChanges(): void {

    if (this.candidatePersonalDetails.name && this.candidatePersonalDetails.collegeName && this.candidatePersonalDetails.socialLinkGithub)  {
      if(this.candidatePersonalDetails && this.candidatePersonalDetails.collegeData.length == 0){
        this.addCollege();
        debugger;
    }
    } else {
      this.getData();
      console.log( this.educationList)
      if(this.candidatePersonalDetails && this.candidatePersonalDetails.collegeData.length == 0){
        this.addCollege();
      }
    }

    console.log(this.candidatePersonalDetails)
    // this.candidatePersonalDetails['collegeData'] = [{
    //   collage: "",
    //   degree: "",
    //   passingYear: ""
    // }]
    
  }
  setFutureMonthRestriction(passingYear:any) {
    passingYear.control.setValidators(this.validateCompletionYear(this.maxyear));
    passingYear.control.updateValueAndValidity();

  }
    validateCompletionYear(maxyear: string): any {
      return (control: any) => {
        const passingYear = control.value;
        if (passingYear > maxyear || passingYear<1900) {
          return { futureMonth: true };
        }
        return null;
      };
    }
   
  
  getData() {
    this.candidatePersonalDetails = {
      name: this.candidateList?.name,
      email: this.candidateList?.emailList?.primary,
      phoneNo: this.candidateList?.number,
      location: this.candidateList?.location,
      collegeData: this.educationList,
      // collegeName: this.educationList[0]?.collage,
      // collegeDegree: this.educationList[0]?.degree,
      // passingYear: this.educationList[0]?.passingYear,
      // SK: this.educationList[0]?.SK,
      // PK: this.educationList[0]?.PK,
      // collegeName1: this.educationList[1]?.collage,
      // collegeDegree1: this.educationList[1]?.degree,
      // passingYear1: this.educationList[1]?.passingYear,
      // SK1: this.educationList[1]?.SK,
      // PK1: this.educationList[1]?.PK,
      about: this.candidateList?.about,
      socialLinkGithub: this.candidateSocial?.github,
      socialLinklinkdin: this.candidateSocial?.linkedin,
      socialLinktwitter: this.candidateSocial?.twitter,
      socialSk: this.candidateSocial?.SK,
      socialPk: this.candidateSocial?.PK,
      profilePicUrl: this.candidateList?.profileImageAwsS3SignedUrl? this.candidateList?.profileImageAwsS3SignedUrl : "/assets/public/candidate-img.png",
      isEmailVerified: this.candidateList?.isEmailVerified,
      isNumberVerified: this.candidateList?.isEmailVerified,
      country: this.candidateList?.country ? this.candidateList?.country : ""
    }
  }

  updateEducationDetails() {
    // || field.passingYear.trim() !== ''
    const nonBlankFields = this.candidatePersonalDetails.collegeData.filter((field: { collage: string; degree: string; passingYear: string; }) => field.collage.trim() !== '' || field.degree.trim() !== '' );
    // Save the non-blank fields
    this.savedValues = [...nonBlankFields];
    this.candidatePersonalDetails.collegeData = this.savedValues;
  }

  async createEducation(form: any): Promise<void> {
    // console.log(this.candidatePersonalDetails)
    // this.nextStep.emit(this.candidatePersonalDetails)
    this.onSuccess.emit(this.candidatePersonalDetails);
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.files) {
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file: File = files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data URL


        // Check if the file type is PDF
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
          // Process the PDF file as needed
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          this.candidatePersonalDetails.fileName = this.fileName,
            this.candidatePersonalDetails.fileToUpload = this.fileToUpload,
            this.candidatePersonalDetails.fileType = this.fileType;
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.candidatePersonalDetails.profilePicUrl = event.target?.result as string;
          }
          this.picErrorMessage = ""
          console.log('Selected file type:', file);
        } else {
          // Display an error for an invalid file type
          console.error('Invalid file type. Please upload a supported file.');
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
          this.fileName = "";
          this.fileType = "";
          this.candidatePersonalDetails.fileName = this.fileName,
            this.candidatePersonalDetails.fileToUpload = this.fileToUpload,
            this.candidatePersonalDetails.fileType = this.fileType;
          this.picErrorMessage = "Please upload a jpg, png image only."
        }
      }
    }
  }
  openOtpModal(){
    this.openModal(ModalType.OTP_VERIFICATION);
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

  receiveDataFromChild(data: any){
    this.modal.cancel();
  }

  addCollege() {
    if (this.candidatePersonalDetails.collegeData.length < 4) {
      this.candidatePersonalDetails.collegeData.push({ collage: "", degree: "", passingYear: "" });
    }
  }

  // Method to check if all previous fields are filled
  areAllPreviousFieldsFilled(): boolean {
    return this.candidatePersonalDetails.collegeData.every((field: { collage: string; degree: string; passingYear: string; }) => {
      const { collage, degree, passingYear } = field;
      // Check if all fields are filled and passingYear is a valid year
      return collage !== '' && degree !== '' && passingYear !== '' && /^[0-9]+$/.test(passingYear);
    });
  }
  
  removeField(index: number) {
    this.candidatePersonalDetails.collegeData.splice(index, 1);
  }

  // validateAddButton() {
  //   let status = false;
  //   this.candidatePersonalDetails.collegeData.forEach((element: { collage: string; degree: string; passingYear: string; }) => {
  //     if(element.collage.trim().length>0 && element.degree.trim().length>0 && element.passingYear.trim().length>0)
  //     {

  //       status = true;

  //     }
  //   });
  //   return status;
  // }

}
