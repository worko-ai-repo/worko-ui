import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import * as data from 'src/assets/data/data.json';
import { ReqGuidanceService } from '../../services/req-guidance.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';


@Component({
  selector: 'app-request-guidence',
  templateUrl: './request-guidence.component.html',
  styleUrls: ['./request-guidence.component.scss'],


})
export class RequestGuidenceComponent implements OnInit {
  @ViewChild('largeModal') largeModal!: ElementRef;
  @Input() selectedCompany: any;
serviceText=''
  isDivOpen: boolean = true;
  reqGuidenceArray: any[] = [];
  isDivShow: boolean = true
  selectedService: any = '';
  serviceButtonHide: boolean = true;
  isFormVisible: boolean = false;
  isButtonScreen: boolean = true;
  requestSentScreen: boolean = false;
  scheduleScreen: boolean = false;
  pendingScreen: boolean = false;
  rejectedScreen: boolean = false;
  showSideImage: boolean = true;
  emailAddress: string = "";
  masterSrvList: any[] = [];

  masterSrvForm: any = {
    SK: 0,
    details: "",
    isActive: true,
    name: ""
  }
  selectedServiceId: string = "";

  reqGuidanceForm: any = {
    "mentorLevel": 0,
    "slot1Date": "",
    "slot1Time": "",
    "slot2Date": "",
    "slot2Time": "",
    "slot3Date": "",
    "slot3Time": "",
    "details": "",
    "masterServiceId":""
  };

  interviewGuidanceForm: any = {
    "mentorLevel":"",
    "slot1":"",
    "details":"",
    "masterServiceId": "",
    "companySK":"",
    "role":"",
  };

  constructor(private reqGuidanceSrv: ReqGuidanceService, private storage:StorageService) { }
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getmasterService()
 
  }

  getmasterService() {
    this.reqGuidanceSrv.getMasters().subscribe({
      next: (response) => {
        this.masterSrvList = response;
       
      },
      error: (error) => {
        console.error(error);
      },

    })
  }
  checkReqGuidance(reqGuidanceData: any) {
    this.reqGuidanceSrv.createreqGuidance(reqGuidanceData, this.emailAddress).then(async (response) => {
      if (response) {
       
        this.getServiceStatus(response.serviceRequestId);
      } else {
      
      }
    })
  }

  async submitInterviewGuidance(form: any): Promise<void> {
    const interviewGuidanceData = {
      slot1: new Date(this.interviewGuidanceForm.slot1).toISOString(),
      details: this.interviewGuidanceForm.details,
      mentorLevel: this.interviewGuidanceForm.mentorLevel,
      masterServiceId: this.selectedServiceId,
      companySK: this.selectedCompany.SK,
      role: this.interviewGuidanceForm.role
    }
    this.reqGuidanceSrv.setInterviewGuidance(interviewGuidanceData, this.emailAddress).then(async (response) => {
      if (response) {
       
        this.getServiceStatus(response.serviceRequestId);
      } else {
       
      }
    })
  }
  getServiceStatus(serviceRequestId: any) {
    this.reqGuidanceSrv.getServiceStatus(serviceRequestId, this.emailAddress).then(async (response) => {
      if (response) {
       
        this.requestSentScreen = true;
        this.isFormVisible = false;
        this.selectedService = "";
        this.isButtonScreen = false;
        this.showSideImage = false;
      } else {
       
      }
    })

  }
  async submit(form: any): Promise<void> {
    const reqGuidanceData = {
      slot1: new Date(this.reqGuidanceForm.slot1Date + 'T' + this.reqGuidanceForm.slot1Time).toISOString(),
      slot2: new Date(this.reqGuidanceForm.slot2Date + 'T' + this.reqGuidanceForm.slot2Time).toISOString(),
      slot3: new Date(this.reqGuidanceForm.slot3Date + 'T' + this.reqGuidanceForm.slot3Time).toISOString(),
      details: this.reqGuidanceForm.details,
      mentorLevel: this.reqGuidanceForm.mentorLevel,
      masterServiceId: this.selectedServiceId,
      companySK: this.selectedCompany.SK,
    }
    this.checkReqGuidance(reqGuidanceData)
  }

  
  selectService(service: any) {
    this.selectedService = service.name;
    this.selectedServiceId = service.SK;
    // this.isFormVisible = true;
    this.isButtonScreen = false;
    this.showSideImage = true;
    if(this.selectedService==='Career guidance'){
      this.serviceText=`Unlock your potential with personalized career insights and actionable plans tailored to your aspirations.<br>Receive guidance from industry experts with firsthand experience in your desired field or role.`;
    } else if(this.selectedService==='Mock Interview'){
      this.serviceText=`Sharpen your interview skills with realistic simulations and expert feedback to ace your next opportunity.<br>Conduct mock interviews with industry experts who understand the intricacies of your field or role.`;
    } else if(this.selectedService==='Resume Review'){
      this.serviceText=`Craft a standout resume that showcases your achievements and skills with our expert review and optimization services.<br>Receive feedback and recommendations from industry experts who understand what recruiters seek in your field or role.`;
    }
   
  }

  resetForm(){
    this.serviceButtonHide = false;
    this.isFormVisible = false;
    this.requestSentScreen = false;
    this.scheduleScreen = false;
    this.pendingScreen = false;
    this.rejectedScreen = false;
  }

  getTomorrowDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    return tomorrowDate;
  }
  getFutureDate(): string {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 45); // Adding 45 days
    const futureDateString = futureDate.toISOString().split('T')[0];
    return futureDateString;
  }

  goBack() {
      // Reset requestGuidanceForm
      this.reqGuidanceForm = {
        mentorLevel: 0,
        slot1Date: '',
        slot1Time: '',
        slot2Date: '',
        slot2Time: '',
        slot3Date: '',
        slot3Time: '',
        details: '',
        masterServiceId: ''
    };

    this.interviewGuidanceForm= {
      mentorLevel:0,
      slot1:'',
      details:'',
      masterServiceId: '',
      companySK:'',
      role:'',
    };

    // Handle the click event, for example, navigate back in history
    this.selectedService=''
    this.isButtonScreen=true;
  }
  
  
}
