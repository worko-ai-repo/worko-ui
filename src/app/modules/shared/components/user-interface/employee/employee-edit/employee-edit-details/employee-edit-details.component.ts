import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryCodes} from 'src/app/modules/shared/data/country.data';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-employee-edit-details',
  templateUrl: './employee-edit-details.component.html',
  styleUrls: ['./employee-edit-details.component.scss'],


})
export class EmployeeEditDetailsComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() employeeSocial: any;
  @Output() nextStep = new EventEmitter<void>();
  // @Output() nextStepSecond = new EventEmitter<void>();
  @Output() nextStepSecond = new EventEmitter();
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage:string="";
  successtitle:string="";
  constructor(private _formBuilder: FormBuilder, private renderer: Renderer2, private el: ElementRef) { }



  @Input() employeeDetails: any;
  @Input() employeePersonalData: any = {
    name: "",
    email: "",
    number: "",
    about: "",
    socialLinkGithub: "",
    socialLinklinkdin: "",
    socialLinktwitter: "",
    location: "",
    fileName: "",
    fileToUpload: "",
    fileType: "",
    profileImageAwsS3SignedUrl: ""
  
  };
  form: any;
//  profilePicUrl: string = "/assets/public/candidate-img.png";
countryCodes: any = CountryCodes;
picErrorMessage: string = ""


  ngOnInit() {
    // Set the first step as active
    // this.setActiveStep(this.currentStep);

  }

  ngOnChanges(): void {

    if (this.employeePersonalData && this.employeePersonalData.about && this.employeePersonalData.location  && this.employeePersonalData.socialLinklinkdin 
     ) {

    } else {
      this.getData();
      // this.employeePersonalData.country = this.employeeDetails?.country;
      // console.log(this.employeePersonalData.country)
    }
    // console.log(this.candidateProfessionalDetails)
  }

  createEmployee(form: any) {
     this.nextStepSecond.emit(this.employeePersonalData);
  }


  getData() {
    this.employeePersonalData = {
      name: this.employeeDetails?.name,
      email: this.employeeDetails?.emailList?.primary,
      number: this.employeeDetails?.number,
      about: this.employeeDetails?.about,
      socialLinkGithub: this.employeeSocial?.github,
      socialLinklinkdin: this.employeeSocial?.linkedin,
      socialLinktwitter: this.employeeSocial?.twitter,
      location: this.employeeDetails?.location,
      country: this.employeeDetails?.country ? this.employeeDetails?.country : "",
      profilePicUrl: this.employeeDetails?.profileImageAwsS3SignedUrl? this.employeeDetails?.profileImageAwsS3SignedUrl : "/assets/public/candidate-img.png"

    }
    console.log( this.employeePersonalData )

  }


  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.files) {
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file: File = files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data URL

        // reader.onload = (event) => { // called once readAsDataURL is completed
        //   this.profilePicUrl = event.target?.result as string;
        // }

        // Check if the file type is PDF
        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
          // Process the PDF file as needed
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          this.employeePersonalData.fileName = this.fileName,
            this.employeePersonalData.fileToUpload = this.fileToUpload,
            this.employeePersonalData.fileType = this.fileType

          reader.onload = (event) => { // called once readAsDataURL is completed
            this.employeePersonalData.profilePicUrl = event.target?.result as string;
          }
          // this.picErrorMessage = ""
          // console.log('Selected file type:', file);
        } else {
          // Display an error for an invalid file type
          this.successmessage="Please upload a jpg, png image only."
          this.successtitle="Error"
          this.openModal(ModalType.SUCCESS_MESSAGE)
          
          //console.error('Invalid file type. Please upload a supported file.');
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
          this.fileName = "";
          this.fileType = "";
          this.employeePersonalData.fileName = this.fileName,
          this.employeePersonalData.fileToUpload = this.fileToUpload,
          this.employeePersonalData.fileType = this.fileType;
          this.picErrorMessage = "Please upload a jpg, png image only."
        }
      }
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
    // this.referrralComponent.showReferrelRow = true;
    this.modal.cancel();
  }

  cancel(){
    this.modal.cancel();
  }
}





// stepper.component.ts










