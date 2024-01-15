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
  @Output() onSuccess = new EventEmitter<void>();


  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  emailAddress: any = "";
  candidateDetailsList: any = "";
  profilePicUrl: string = "/assets/public/candidate-img.png";

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
    socialSk: "",
    socialPk: ""



  };
  form = {

  }


  constructor(private candidateSrv: CandidateProfileService) { }

  ngOnInit(): void {
    console.log(this.candidateList);

  }

  ngOnChanges(): void {
    // console.log(this.candidateList, "candidateList");
    // console.log(this.educationList, "educationList");
    // console.log(this.candidateSocial, "candidateSocial");

    if (this.candidatePersonalDetails.name && this.candidatePersonalDetails.collegeName && this.candidatePersonalDetails.socialLinkGithub) {

    } else {
      this.getData();
    }

    console.log(this.candidatePersonalDetails)
  }
  getData() {
    this.candidatePersonalDetails = {
      name: this.candidateList?.name,
      email: this.candidateList?.emailList?.primary,
      phoneNo: this.candidateList?.number,
      location: this.candidateList?.location,
      collegeName: this.educationList[0]?.collage,
      collegeDegree: this.educationList[0]?.degree,
      passingYear: this.educationList[0]?.passingYear,
      SK: this.educationList[0]?.SK,
      PK: this.educationList[0]?.PK,
      collegeName1: this.educationList[1]?.collage,
      collegeDegree1: this.educationList[1]?.degree,
      passingYear1: this.educationList[1]?.passingYear,
      SK1: this.educationList[1]?.SK,
      PK1: this.educationList[1]?.PK,
      about: this.candidateList?.about,
      socialLinkGithub: this.candidateSocial?.github,
      socialLinklinkdin: this.candidateSocial?.linkedin,
      socialLinktwitter: this.candidateSocial?.twitter,
      socialSk: this.candidateSocial?.SK,
      socialPk: this.candidateSocial?.PK
    }
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

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.profilePicUrl = event.target?.result as string;
        }

        // Check if the file type is PDF
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
          // Process the PDF file as needed
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          console.log('Selected file type:', file);
        } else {
          // Display an error for an invalid file type
          console.error('Invalid file type. Please upload a supported file.');
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
        }
      }
    }
  }

}
