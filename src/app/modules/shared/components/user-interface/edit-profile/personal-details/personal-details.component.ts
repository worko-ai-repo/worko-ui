import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  

  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @Input() candidateList: any;
  @Input() workExperienceDetails: any;
  @Input() certificationList: any;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Input() achievementsList: any;
 

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
  maxCertificate: boolean = false;
  title: string = '';
  date: string = '';
  instituteName: string= "";
  newCoreSkills: any;
  coreSkill: string = "";
  skillYears: string = "";
  newCertName: string = '';
  newSoftSkill: string = "";
  certificateCompany: string = "";
  certificateYear: string ="";
  
  constructor(private authService: AuthService , private elRef: ElementRef) { }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value);
        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })

    );

  }

  onOptionSelected(event: any): void {
    this.selectedCompany = event.option.value;
  }

  displayFn(option: any): string {
    if (option) {
      this.companyName = option.name;
      this.companySK = option.SK;
      return option.name;
    } else {
      return '';
    }
  }
  ngOnChanges(): void {

    if(  this.candidateProfessionalDetails.ctc && this.candidateProfessionalDetails.certificationNames && this.candidateProfessionalDetails.achievements){

    }else{
      this.getData();
    }
    // console.log(this.candidateProfessionalDetails)
  }

  goBack() {
    this.candidateProfessionalDetails.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.candidateProfessionalDetails.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.previousStep.emit(this.candidateProfessionalDetails);
  }
  userFresher() {
    this.candidateProfessionalDetails.isCandidateFresher = !this.candidateProfessionalDetails.isCandidateFresher;
}

  getData() {
    this.candidateProfessionalDetails = {
      companyName: this.workExperienceDetails?.companyName,
      officialEmail: this.workExperienceDetails?.emailId,
      designation: this.workExperienceDetails?.designation,
      department:this.workExperienceDetails?.department,
      ctc: this.candidateList?.CTC,
      ectc: this.candidateList?.ECTC,
      noticePeriod: this.candidateList?.noticePeriod,
      certificationNames: this.certificationList?.certifications,
      softSkills: this.certificationList?.softSkills,
      coreSkillList: this.certificationList?.coreSkills,
      achievements: this.achievementsList,
      companySK: this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK,
      isCandidateFresher: this.candidateList.isCandidateFresher
    }
  }

  currentYear = new Date().getFullYear().toString();
  currentMonth = (new Date().getMonth() + 1).toString();
   maxDate = this.currentYear + "-"+(this.currentMonth.length === 1 ? '0' + this.currentMonth : this.currentMonth);
 
   /*code to block the future month and month less than 1900-01*/
 setFutureMonthRestriction(completionyear:any) {
  
   completionyear.control.setValidators(this.validateCompletionYear(this.maxDate));
  
 
 }
   validateCompletionYear(maxDate: string): any {
     return (control: any) => {
       const completionYear = control.value;
       if (completionYear > maxDate || completionYear<'1900-01') {
         return { futureMonth: true };
       }
       return null;
     };
   }
 
   /*code to block the achievement month and month less than 1900-01*/
   setFutureMonth(achievementdate:any) {
     achievementdate.control.setValidators(this.validateAchievementYear(this.maxDate));
 
     }
 
 
   validateAchievementYear(maxDate: string): any {
       return (control: any) => {
         const achievementdate = control.value;
         if (achievementdate > maxDate || achievementdate<'1900-01') {
           return { futureMonth: true };
         }
         return null;
       };
     }

  async createProfessionalDetails(form: any) {
    // console.log(this.candidateProfessionalDetails)
    // this.nextStep.emit(this.candidateProfessionalDetails)
    this.candidateProfessionalDetails.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.candidateProfessionalDetails.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.onSuccess.emit(this.candidateProfessionalDetails);
  }

  addAchievement() {
    if (! this.candidateProfessionalDetails.achievements) {
      this.candidateProfessionalDetails.achievements = [];
    }
    
    if (this.title && this.date && this.instituteName) {
      // Create a new achievement object
      const newAchievement = {
        title: this.title,
        achievDate: new Date(this.date).toISOString() ,
        acquiredFrom: this.instituteName
      };
      // Push the new achievement object to the achievements array
      this.candidateProfessionalDetails.achievements.push(newAchievement);
      // Clear the input fields
      this.title = '';
      this.date = '';
      this.instituteName = "";

    }
  }

  isValidForm(): boolean {
    // Return true if both title and date have values, otherwise false
    return !!this.title && !!this.date;
  }
  // Function to remove an achievement by title
  removeAchievement(title: string) {
    // Find the index of the achievement with the specified title
    const indexToRemove =  this.candidateProfessionalDetails.achievements.findIndex((achievement: any) => achievement.title === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.candidateProfessionalDetails.achievements.splice(indexToRemove, 1);
    }
  }

  addCoreSkills() {
    if (!this.candidateProfessionalDetails.coreSkillList) {
      this.candidateProfessionalDetails.coreSkillList = [];
    }
    if (this.coreSkill && this.skillYears) {
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
      if (this.candidateProfessionalDetails.certificationNames.length < 5) {
        // Create a new achievement object
        const newCertificate = {
          certName: this.newCertName,
          completionDate: new Date(this.certificateYear).toISOString() ,
          issuedInstitution: this.certificateCompany
        };
        // Push the new achievement object to the achievements array
        this.candidateProfessionalDetails.certificationNames.push(newCertificate);
        // Clear the input fields
        this.certificateCompany = '';
        this.certificateYear = '';
        this.newCertName = "";
        this.maxCertificate= false;
      } else {
        // Alert or handle the case where the limit is reached
        console.error('Cannot add more than 10 certificates.');
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


}





















