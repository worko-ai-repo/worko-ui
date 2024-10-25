import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../modal/modal.component';
declare var bootstrap: any;
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {


  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @Input() candidateList: any;
  @Input() candidatePersonalDetails: any;
  @Input() workExperienceDetails: any;
  @Input() certificationList: any;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Input() achievementsList: any;
  @Input() candidateUploadDetails: any;
  @ViewChild('softSkillInput') softSkillInput!: ElementRef<HTMLInputElement>;
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  companyName: string = "";
  companySK: string = "";
  subscription: Subscription = new Subscription();
  selectedCompany: any;
  @Input() candidateProfessionalDetails: any = {
    companyName: "",
    officialEmail: "",
    desigination: "",
    department: "",
    ctc: "",
    ectc: "",
    noticePeriod: "",
    certificationNames: "",
    softSkills: "",
    coreSkillList: "",
    achievements: "",

  }
  form: any = {

  }
  isDisabled: boolean = false;
  maxCertificate: boolean = false;
  title: string = '';
  achievementmonth: string = '';
  instituteName: string = "";
  newCoreSkills: any;
  coreSkill: string = "";
  skillYears: string = "";
  newCertName: string = '';
  newSoftSkill: string = "";
  certificateCompany: string = "";
  certificateYear: string = "";

  currentYear = new Date().getFullYear().toString();
  //currentMonth = (new Date().getMonth() + 1).toString();
  currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  maxDate = this.currentYear + "-" + (this.currentMonth.length === 1 ? '0' + this.currentMonth : this.currentMonth);
  month: number = 0;
  achmonth: number = 0;
  fileErr: string = "";
  fileName: string = "";
  fileType: string = "";
  fileToUpload: File | null = null;

  constructor(private authService: AuthService, private elRef: ElementRef, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     switchMap((value: any) => {
  //       if (value && value.length >= 1) {
  //         return this.authService.getCompanyName(value);
  //       } else {
  //         // If value.length is less than 1, return an empty array or null
  //         return [];
  //       }
  //     })

  //   );

  this.filteredOptions = this.myControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value: any) => {
      if (value && value.length >= 1) {
        return this.authService.getCompanyName(value).pipe(
          map((response: any) => {
            const results = Array.isArray(response.data) ? response.data : []; // Ensure results is an array
  
            return results.map((company: any)=> ({
              id: company.SK, // Remove the 'ID#' prefix from SK
              name: company.name
            }));
          })
        );
      } else {
        return [];
      }
    })
  );
  
  }
   

  focusInput(): void {
    this.softSkillInput.nativeElement.focus();
  }

  ngAfterViewInit(): void {
    // Find all elements with the class 'tooltip-container'
    const tooltipTriggerList = Array.from(document.querySelectorAll('.tooltip-container'));

    // Initialize Bootstrap tooltips for each found element
    const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }




  onOptionSelected(event: any): void {
    this.selectedCompany = event.option.value;
  }

  displayFn(option: any): string {
    if (typeof option === 'string') {

      //   this.companyName = option;
      // this.companySK ="";
      return option;
    } else if (typeof option === 'object' && option.name) {
    
      this.companyName = option.name;
      this.companySK = option.id;
      return option.name;
    } else {

      return '';
    }
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.candidateProfessionalDetails?.ctc && this.candidatePersonalDetails?.ectc && this.candidatePersonalDetails?.department &&
      this.candidateProfessionalDetails?.desigination 
    ) {
      this.isDisabled=true
    } else if (this.candidateProfessionalDetails.isCandidateFresher) {
      this.isDisabled=false
    }
    else {
      this.getData();
    }
    // console.log(this.candidateProfessionalDetails)
    if (changes['candidateProfessionalDetails']) {
      // Call method to check if the checkbox should be disabled
      this.checkIfDisabled();
    }
  }

  goBack() {
    // debugger

    if (this.workExperienceDetails) {
      if (this.candidateProfessionalDetails.companyName === this.workExperienceDetails.companyName && this.candidateProfessionalDetails.companySK === this.workExperienceDetails.SK) {

        this.candidateProfessionalDetails.companyName = this.workExperienceDetails.companyName;
        this.candidateProfessionalDetails.companySK = this.workExperienceDetails.SK;
      } else {
        this.candidateProfessionalDetails.companyName = this.candidateProfessionalDetails.companyName;
        this.candidateProfessionalDetails.companySK = this.candidateProfessionalDetails.companySK;
        // console.log(this.candidateProfessionalDetails.companyName);
        // console.log(this.candidateProfessionalDetails.companySK)
      }
    }
    // this.candidateProfessionalDetails.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    // this.candidateProfessionalDetails.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    //debugger;
    this.previousStep.emit(this.candidateProfessionalDetails);
  }


  // function to check if all required fields are filled to disable the fresher checkbox
  checkIfDisabled(): void {
   
    if (this.candidateProfessionalDetails.companyName && this.candidateProfessionalDetails.designation && this.candidateProfessionalDetails.department && 
      this.candidateProfessionalDetails.ctc && this.candidateProfessionalDetails.ectc) {
      this.isDisabled = true;
    }
  }

  userFresher(): void {
    // Check if the checkbox should be disabled before toggling fresher status
  
    this.checkIfDisabled();
    if (!this.isDisabled) {
      this.candidateProfessionalDetails.isCandidateFresher = 
        !this.candidateProfessionalDetails.isCandidateFresher;
    }
  }
  getData() {

    this.candidateProfessionalDetails = {
      companyName: this.candidateList?.candidateExperience?.companyName,
      //officialEmail: this.workExperienceDetails?.emailId,
      designation: this.candidateList?.candidateExperience?.designation,
      department: this.candidateList?.candidateExperience?.department,
      ctc: this.candidateList?.CTC,
      ectc: this.candidateList?.ECTC,
      yoe: this.candidateList?.YOE,
      noticePeriod: this.candidateList?.noticePeriod,
      certificationNames: this.certificationList?.certifications,
      softSkills: this.certificationList?.softSkills,
      coreSkillList: this.certificationList?.coreSkills,
      achievements: this.achievementsList,
      // companySK: this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.companyId,
      // isCandidateFresher: this.candidateList.isCandidateFresher
      isCandidateFresher: this.candidateList?.isCandidateFresher ?? false,
      fileName : this.candidateList.CV,
      candidateUploadDetails: {
        uploadCV: this.candidateList?.CV,
        coverLetter: this.candidateList?.coverLetter,
        fileName: "",
        fileToUpload: "",
        fileType: ""
      }
     
    }
  

   


  }



  //  pattern="^(19|20)\d{2}-(0[1-9]|1[0-2])$";
  //   validatePattern(completionyear: any): boolean {
  //   return this.pattern.test(completionyear);
  // }

  /*code to block the future month and month less than 1900-01*/
  setFutureMonthRestriction(completionyear: any) {
    completionyear.control.setValidators(this.validateCompletionYear(this.maxDate));
  }

  validateCompletionYear(maxDate: string): any {
    return (control: any) => {
      let completionYear = control.value;

      this.month = completionYear.split('-')[0]
      if (!completionYear || completionYear.trim() === '') {
        return null;
      }

      if (!completionYear.includes('-')) {
        return { missingDash: true };
      }
      if (completionYear.length !== 7) {
        return { futureMonths: true };
      }

      const year = completionYear.split('-')[1];
      const month = completionYear.split('-')[0];
      //console.log(this.currentMonth,this.currentYear)

      // Compare achievementdate with the present month and year
      if (year < 1900 || (year === 1900 && month < '01') || (year === this.currentYear && month > this.currentMonth) || year > this.currentYear || month < '01' || month > '12') {
        //  debugger 
        return { invalidDate: true };
      }
      return null;
    };
  }

  /*code to block the achievement month and month less than 1900-01*/
  setFutureMonth(achievementdate: any) {
    achievementdate.control.setValidators(this.validateAchievementYear(this.maxDate));

  }
  validateAchievementYear(maxDate: string): any {
    return (control: any) => {
      let achievementdate = control.value;
      this.achmonth = achievementdate.split('-')[0]
      // console.log( this.achmonth )

      if (!achievementdate || achievementdate.trim() === '') {
        // debugger
        return null;
      }

      if (!achievementdate.includes('-')) {
        // debugger
        return { missingDash: true };
      }
      if (achievementdate.length !== 7) {
        return { futureMonths: true };
      }
      const maxDateMMYYYY = `${maxDate.split('-')[1]}-${maxDate.split('-')[0]}`;

      // if (achievementdate > maxDateMMYYYY || achievementdate < '01-1900' || this.achmonth > 12 || this.achmonth == 0) {
      //   debugger
      //   return { futureMonths: true };
      // }
      const year = achievementdate.split('-')[1];
      const month = achievementdate.split('-')[0];
      // console.log(this.currentMonth,this.currentYear)

      // Compare achievementdate with the present month and year
      if (year < 1900 || (year === 1900 && month < '01') || (year === this.currentYear && month > this.currentMonth) || year > this.currentYear || month < '01' || month > '12') {

        return { invalidDate: true };
      }
      return null;
    };
  }

  // setFutureMonth(achievementdate: any) {

  //   achievementdate.control.setValidators(this.validateAchievementYear(this.maxDate));
  // }

  // validateAchievementYear(maxDate: string): any {

  //   return (control: any) => {
  //     let achievementdate = control.value;

  //     if (!achievementdate || achievementdate.trim() === '') {
  //       return null;
  //     }

  //     if (!achievementdate.includes('-')) {
  //       return { missingDash: true };
  //     }

  //     // Split the date string to extract month and year
  //     const [month,year] = achievementdate.split('-');

  //     if (year.length !== 2 || month.length !== 2) {
  //       return { invalidFormat: true }; // Invalid format if year is not 4 digits or month is not 2 digits
  //     }

  //     // Reformat the date to mm-yy format
  //     const mmYYFormat = `${month}-${year.slice(-2)}`;
  //     console.log(mmYYFormat)

  //     if (mmYYFormat > maxDate || mmYYFormat < '01-01' || month > '12' || month === '00') {
  //       debugger
  //       return { futureMonths: true };
  //     }

  //     return null;
  //   };
  // }

  async createProfessionalDetails(form: any) {
    //console.log(this.workExperienceDetails)

    // console.log(this.candidateProfessionalDetails)
    // this.nextStep.emit(this.candidateProfessionalDetails)
    // this.candidateProfessionalDetails.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    // this.candidateProfessionalDetails.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.companyId
    if (!this.candidateProfessionalDetails.isCandidateFresher) {
      if (this.selectedCompany) {
        this.candidateProfessionalDetails.companyName = this.selectedCompany.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
        this.candidateProfessionalDetails.companySK = this.selectedCompany.id ? this.selectedCompany?.id : this.workExperienceDetails?.companyId
      }
    }


    // if(this.workExperienceDetails){
    //    if (this.candidateProfessionalDetails.companyName === this.workExperienceDetails.companyName && this.candidateProfessionalDetails.companySK === this.workExperienceDetails.SK) {

    //     this.candidateProfessionalDetails.companyName = this.workExperienceDetails.companyName;
    //     this.candidateProfessionalDetails.companySK = this.workExperienceDetails.SK;
    //   }else{
    //     this.candidateProfessionalDetails.companyName=this.candidateProfessionalDetails.companyName);
    //     this.candidateProfessionalDetails.companySK=this.candidateProfessionalDetails.companySK;
    //     console.log(this.candidateProfessionalDetails.companyName);
    //     console.log(this.candidateProfessionalDetails.companySK)
    //   }
    // }
    //  }
    this.onSuccess.emit(this.candidateProfessionalDetails);
  }

  addAchievement() {
    if (!this.candidateProfessionalDetails.achievements) {
      this.candidateProfessionalDetails.achievements = [];
    }

    if (this.title && this.achievementmonth && this.instituteName) {
      // Create a new achievement object

      if (this.candidateProfessionalDetails.achievements.length < 10) {

        const [monthStr, yearStr] = this.achievementmonth.split('-');

        // Parse the month and year parts into numbers
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

        // Create a Date object with the parsed month and year
        const achievementDate = new Date(year, month);


        const newAchievement = {
          title: this.title,
          achievDate: achievementDate,
          acquiredFrom: this.instituteName
        };
        // Push the new achievement object to the achievements array
        this.candidateProfessionalDetails.achievements.push(newAchievement);
        // Clear the input fields
        this.title = '';
        this.achievementmonth = '';
        this.instituteName = "";

      } else {
        this.successmessage = "You cannot add more than 10 Achievements."
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)

      }
    }
  }

  isValidForm(): boolean {
    // Return true if both title and date have values, otherwise false
    return !!this.title && !!this.achievementmonth && !!this.instituteName;
  }
  // Function to remove an achievement by title
  removeAchievement(title: string) {
    // Find the index of the achievement with the specified title
    const indexToRemove = this.candidateProfessionalDetails.achievements.findIndex((achievement: any) => achievement.title === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.candidateProfessionalDetails.achievements.splice(indexToRemove, 1);
    }
  }

  cancel() {
    this.closeModal();
  }


  addCoreSkills() {
    if (!this.candidateProfessionalDetails.coreSkillList) {
      this.candidateProfessionalDetails.coreSkillList = [];
    }
    if (this.coreSkill && this.skillYears) {
      if (this.candidateProfessionalDetails.coreSkillList.length < 10) {
        // Create a new achievement object
        const newCoreSkill = {
          skillName: this.coreSkill,
          years: this.skillYears
        };
        // Push the new achievement object to the achievements array
        this.candidateProfessionalDetails.coreSkillList.push(newCoreSkill);

        // Clear the input fields
        this.coreSkill = '';
        this.skillYears = '';
      } else {
        // Alert or handle the case where the limit is reached
        //console.error('Cannot add more than 10 certificates.');
        this.successmessage = "you cannot add more than 10 core skils."
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }
  }

  isCoreSkillsValidForm(): boolean {
    // Return true if both skillYears and coreSkill have values, otherwise false
    return !!this.coreSkill && !!this.skillYears;
  }

  // Function to remove an coreSkills by skillName
  removeCoreSkills(title: string) {

    // Find the index of the achievement with the specified title
    const indexToRemove = this.candidateProfessionalDetails.coreSkillList.findIndex((achievement: any) => achievement.skillName === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.candidateProfessionalDetails.coreSkillList.splice(indexToRemove, 1);
    }
  }
  // addCertificateOnEnter() {

  //   if (this.newCertName.trim() !== '') {
  //     const newCertificate = {
  //       "certName": this.newCertName 
  //     };
  //     this.candidateProfessionalDetails.certificationNames.push(newCertificate);
  //     this.newCertName = ''; // Clear the input field
  //   }
  // }
  isDateInPast(dateString: string): boolean {
    const today = new Date();
    const inputDate = new Date(dateString);
    return inputDate <= today;
  }

  addCertificate() {
    if (!this.candidateProfessionalDetails.certificationNames) {
      this.candidateProfessionalDetails.certificationNames = [];
    }

    if (this.newCertName && this.certificateCompany && this.certificateYear) {

      // const isValidDate = this.isDateInPast(`01/${this.certificateYear}`);
      // if (!isValidDate) {
      //   console.error('Completion date must be in the past.');
      //   return; // Do not add the certificate if the date is in the future
      // }

      // Check if the number of certificates is less than 10
      if (this.candidateProfessionalDetails.certificationNames.length < 10) {
        // Create a new achievement object
        const [monthStr, yearStr] = this.certificateYear.split('-');

        // Parse the month and year parts into numbers
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

        // Create a Date object with the parsed month and year
        const completionDate = new Date(year, month);



        const newCertificate = {
          certName: this.newCertName,
          completionDate: completionDate.toISOString(),
          issuedInstitution: this.certificateCompany
        };
        // Push the new achievement object to the achievements array
        this.candidateProfessionalDetails.certificationNames.push(newCertificate);
        // Clear the input fields
        this.certificateCompany = '';
        this.certificateYear = '';
        this.newCertName = "";
        this.maxCertificate = false;
      } else {
        // Alert or handle the case where the limit is reached
        //console.error('Cannot add more than 10 certificates.');
        this.successmessage = "you cannot add more than 10 certificates."
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)


        this.maxCertificate = true;
      }
    }
  }

  isValidCertificateForm(): boolean {
    // Return true if both title and date have values, otherwise false
    return !!this.newCertName && !!this.certificateYear && !!this.certificateCompany;
  }

  // isCertNameValid(): boolean {
  //   // Check if there is at least one non-empty certificate name
  //   return this.newCertName.split(',').some(certName => certName.trim() !== '');
  // }

  addSoftSkill(event: any) {
    const input = this.elRef.nativeElement.querySelector('.soft-skill-input');
    const value = input.value.trim();

    if (value) {
      const newSkill = {
        "skillName": value,
      };
      if (!this.candidateProfessionalDetails.softSkills) {
        this.candidateProfessionalDetails.softSkills = [];
      }
      this.candidateProfessionalDetails.softSkills.push(newSkill);
      input.value = ''; // Clear the input field
      //console.log(this.candidateProfessionalDetails.softSkills.length)
    }
    event.preventDefault(); // Prevent the default action (form navigation)
  }



  removeSoftSkill(title: string) {

    // Find the index of the achievement with the specified title
    const indexToRemove = this.candidateProfessionalDetails.softSkills.findIndex((softSkill: any) => softSkill.skillName === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.candidateProfessionalDetails.softSkills.splice(indexToRemove, 1);
    }
  }


  removeCertifiates(title: string) {

    // Find the index of the achievement with the specified title
    const indexToRemove = this.candidateProfessionalDetails.certificationNames.findIndex((softSkill: any) => softSkill.certName === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.candidateProfessionalDetails.certificationNames.splice(indexToRemove, 1);
    }
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files) {
      const files: FileList | null = inputElement.files;
  
      if (files && files.length > 0) {
        const file: File = files[0];
      //  || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        // Check if the file type is PDF or DOCX
        if (file.type === 'application/pdf' ) {
          // Process the file as needed
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          this.candidateProfessionalDetails.candidateUploadDetails.fileName = this.fileName;
          this.candidateProfessionalDetails.candidateUploadDetails.fileToUpload = this.fileToUpload;
          this.candidateProfessionalDetails.candidateUploadDetails.fileType = this.fileType;
         // this.showfileError = false;
        } else {
          this.successmessage="Invalid file type. Please upload a PDF file."
          this.successtitle="Error"
          this.openModal(ModalType.SUCCESS_MESSAGE)
          // Display an error for invalid file type
         // console.error('Invalid file type. Please upload a PDF or DOCX file.');
          // Optionally, you can reset the input to clear the invalid selection
         // this.showfileError = true;
          inputElement.value = '';
          this.fileToUpload = null;
          this.fileName = "";
          this.fileType = "";
    
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
    this.modal.cancel();
  }




}





















