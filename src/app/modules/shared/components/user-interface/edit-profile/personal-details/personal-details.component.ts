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
  
 @Input() candidateProfessionalDetails:any={
    companyName:"",
    officialEmail:"",
    desigination:"",
    department:"",
    ctc:"",
    ectc:"",
    noticePeriod:"",
    certificationNames:"",
    softSkills:"",
    skill:"",
    year:"",
    title:"",
    date:"",

  }
  form:any={

  }
  constructor(){}
  ngOnInit(): void {
      
  }
  ngOnChanges(): void {
    // console.log(this.candidateList, "candidateList");
    //  console.log(this.workExperienceDetails, "workExperienceDetails");
    console.log(this.certificationList, "certificationList");
    this.getData();
    console.log( this.candidateProfessionalDetails )
  }

  getData(){
    this.candidateProfessionalDetails = {
      // companyName: this.workExperienceDetails[0]?.companyName,
      // officialEmail: this.workExperienceDetails[0]?.emailId,
      // desigination: this.workExperienceDetails[0]?.designation,
      // department:this.workExperienceDetails[0]?.department,
      ctc: this.candidateList?.CTC,
      ectc: this.candidateList?.ECTC,
      noticePeriod:this.candidateList?.noticePeriod,
      certificationNames:this.certificationList.certifications,
      softSkills:this.certificationList.softSkills,
      skill:this.certificationList.coreSkills,
      year:"",
      title:"",
      date:"",
    }
  }

  async createProfessionalDetails(form : any){
    // console.log(this.candidateProfessionalDetails)
    this.nextStep.emit(this.candidateProfessionalDetails)
  }
}
