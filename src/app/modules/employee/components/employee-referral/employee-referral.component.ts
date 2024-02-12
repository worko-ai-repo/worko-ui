import {  Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent {
  empReferralList: any = "";
  emailAddress: any = "";
  empdetailsList:any="";
  empEducationList:any="";
  empExperienceList:any="";
  empCoreSkillsList:any="";
  empAchievmentsList:any="";
  empAchievmentsDetails:any={};
  empCoreSkillsDetails:any={};
  empExperienceDetails:any={};
  empEducationDetails:any={};
  empDetails:any={};
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;

  constructor(private candidateSrv:CandidateProfileService, private empService: EmployeeProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getEmpReferral();
    this.getEmpReferralDetails();
  }
  onStatusSelected(status: string): void {
    this.selectedStatus = status;
    this.getEmpReferral();
  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }


  async getEmpReferral() {
    let companySK = "01HMR3G2QNYYM47YZ2P9ZVZBPR";
    await this.empService.getEmployeeReferral(this.emailAddress, companySK,  this.selectedStatus ).then(async (response) => {
      if (response) {
        this.empReferralList = response;
        console.log(this.empReferralList + '123');
      }
    })
   
  }
  async getEmpReferralDetails(){
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async(response)=>{
      this.empdetailsList=response;
      this.empDetails=this.empdetailsList;

      console.log('Employee details===>',this.empdetailsList);
    })
    this.getEmpEducationDetails();
  }
  async getEmpEducationDetails(){
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async(response)=>{
      this.empEducationList=response;
      this.empEducationDetails=this.empEducationList;
    })
    this.getWorkExperience();
  }
  async getWorkExperience(){
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async(response)=>{
      this.empExperienceList=response;
      this.empExperienceDetails=this.empExperienceList;
    })
    this.getCoreSkills();
  }
  async getCoreSkills(){
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
     
      this.empCoreSkillsDetails = response; // Assign response to empCoreSkillsDetails
      console.log(this.empCoreSkillsDetails);
    })
    this.getEmpAchievments();
  }
  async getEmpAchievments(){
    await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async(response)=>{
      this.empAchievmentsDetails=response;
    })
  }

  showReferralDetails(data:any){
    this.selectedReferral = data;
  }

}
