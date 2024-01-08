import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  candidateProfessionalDetails:any={
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

  async createProfessionalDetails(form : any){
    console.log(this.candidateProfessionalDetails)
    this.nextStep.emit()
  }
}
