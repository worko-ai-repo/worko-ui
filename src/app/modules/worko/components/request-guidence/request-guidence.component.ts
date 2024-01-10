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
        console.log(response)
      },
      error: (error) => {
        console.error(error);
      },

    })
  }
  checkReqGuidance(reqGuidanceData: any) {
    this.reqGuidanceSrv.createreqGuidance(reqGuidanceData, this.emailAddress).then(async (response) => {
      if (response) {
        console.log(response + 'hello')
        this.getServiceStatus(response.serviceRequestId);
      } else {
        console.log('Hiii')
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
        console.log(response + 'hello')
        this.getServiceStatus(response.serviceRequestId);
      } else {
        console.log('Hiii')
      }
    })
  }
  getServiceStatus(serviceRequestId: any) {
    this.reqGuidanceSrv.getServiceStatus(serviceRequestId, this.emailAddress).then(async (response) => {
      if (response) {
        console.log(response + 'hello')
        this.requestSentScreen = true;
        this.isFormVisible = false;
        this.selectedService = "";
        this.isButtonScreen = false;
        this.showSideImage = false;
        debugger;
      } else {
        console.log('Hiii')
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
  }

  resetForm(){
    this.serviceButtonHide = false;
    this.isFormVisible = false;
    this.requestSentScreen = false;
    this.scheduleScreen = false;
    this.pendingScreen = false;
    this.rejectedScreen = false;
  }

}
