import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  @Input() candidateList: any;
  @Input() workExperienceDetails: any;
  @Input() certificationList: any;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Input() achievementsList: any;
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
    achievements: ""
  }
  form: any = {

  }
  title: string = '';
  date: string = '';
  newCoreSkills: any;
  coreSkill: string = "";
  skillYears: string = "";
  newCertName: string = '';
  newSoftSkill: string = "";
  constructor() { }
  ngOnInit(): void {

  }
  ngOnChanges(): void {
    // console.log(this.candidateList, "candidateList");
    //  console.log(this.workExperienceDetails, "workExperienceDetails");
    // console.log(this.certificationList, "certificationList");
   
    if( this.candidateProfessionalDetails.companyName && this.candidateProfessionalDetails.ctc && this.candidateProfessionalDetails.certificationNames && this.candidateProfessionalDetails.achievements){

    }else{
      this.getData();
    }
    // console.log(this.candidateProfessionalDetails)
  }

  goBack() {
    this.previousStep.emit(this.candidateProfessionalDetails);
  }

  getData() {
    this.candidateProfessionalDetails = {
      companyName: this.workExperienceDetails?.companyName,
      officialEmail: this.workExperienceDetails?.emailId,
      desigination: this.workExperienceDetails?.designation,
      department:this.workExperienceDetails?.department,
      ctc: this.candidateList?.CTC,
      ectc: this.candidateList?.ECTC,
      noticePeriod: this.candidateList?.noticePeriod,
      certificationNames: this.certificationList?.certifications,
      softSkills: this.certificationList?.softSkills,
      coreSkillList: this.certificationList?.coreSkills,
      achievements: this.achievementsList,
    }
  }

  async createProfessionalDetails(form: any) {
    // console.log(this.candidateProfessionalDetails)
    // this.nextStep.emit(this.candidateProfessionalDetails)

    this.onSuccess.emit(this.candidateProfessionalDetails);
  }

  addAchievement() {
    // Check if both title and date are provided
    if (!this.achievementsList) {
      this.achievementsList = [];
    }
    if (this.title && this.date) {
      // Create a new achievement object
      const newAchievement = {
        title: this.title,
        achievDate: this.date
      };
      // Push the new achievement object to the achievements array
      this.achievementsList.push(newAchievement);
      console.log(this.achievementsList);
      // Clear the input fields
      this.title = '';
      this.date = '';

    }
  }

  isValidForm(): boolean {
    // Return true if both title and date have values, otherwise false
    return !!this.title && !!this.date;
  }
  // Function to remove an achievement by title
  removeAchievement(title: string) {
    // Find the index of the achievement with the specified title
    const indexToRemove = this.achievementsList.findIndex((achievement: any) => achievement.title === title);

    // If the achievement is found, remove it
    if (indexToRemove !== -1) {
      this.achievementsList.splice(indexToRemove, 1);
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
      console.log(this.candidateProfessionalDetails.coreSkillList);
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
  addCertificateOnEnter() {

    if (this.newCertName.trim() !== '') {
      const newCertificate = {
        "certName": this.newCertName 
      };
      this.candidateProfessionalDetails.certificationNames.push(newCertificate);
      this.newCertName = ''; // Clear the input field
    }
  }

  addCertificate() {

  const certNamesArray = this.newCertName.split(',');

  certNamesArray.forEach((certName:any) => {
    const trimmedCertName = certName.trim();
    if (trimmedCertName !== '') {
      const newCertificate = {
        "certName": trimmedCertName,
      };
      this.candidateProfessionalDetails.certificationNames.push(newCertificate);
    }
   
  });
  this.newCertName = ''; // Clear the input field
  }

  isCertNameValid(): boolean {
    // Check if there is at least one non-empty certificate name
    return this.newCertName.split(',').some(certName => certName.trim() !== '');
  }

  addSoftSkill(){
    const skillsArray = this.newSoftSkill.split(',');

    skillsArray.forEach((skillName:any) => {
      const trimmedskillName = skillName.trim();
      if (trimmedskillName !== '') {
        const newSkill = {
          "skillName": trimmedskillName,
        };
        this.candidateProfessionalDetails.softSkills.push(newSkill);
      }
     
    });
    this.newSoftSkill = ''; // Clear the input field
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
