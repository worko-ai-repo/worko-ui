import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as data from 'src/assets/data/data.json';
import { ReqGuidanceService } from '../../services/req-guidance.service';



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
  selectedService: string = '';
  serviceButtonHide: boolean = true;
  isFormVisible: boolean = false;
  emailAddress: string = "prashant@worko.ai";
  masterSrvList:any[]=[];

  masterSrvForm: any = {
    SK: 0,
    details:"",
    isActive:true,
    name: ""
  }

  reqGuidanceForm: any = {
    "mentorLevel": 0,
    "slot1":Date(),
    "slot2": Date(),
    "slot3": Date(),
    "details": "",
    "masterServiceId": "abc123xyz"
  };

  constructor(private reqGuidanceSrv: ReqGuidanceService) { }
  ngOnInit(): void {
    this.getmasterService()
  }

  getmasterService() {
    this.reqGuidanceSrv.getMasters().subscribe ({
     next:(response)=>{
        this.masterSrvList = response;
        console.log(response)
     },
      error: (error) => {
      console.error(error);
    },
      
    })
  }
  checkReqGuidance() {
    this.reqGuidanceSrv.createreqGuidance(this.reqGuidanceForm, this.emailAddress).then(async (Response) => {
      if (Response) {
        console.log(Response + 'hello')
      } else {
        console.log('Hiii')
      }
    })
  }
  async submit(form: any): Promise<void> {
    const reqGuidanceData = {
      slot1: this.reqGuidanceForm.date1 + this.reqGuidanceForm.time1,
      slot2: this.reqGuidanceForm.date2 + this.reqGuidanceForm.time2,
      slot3: this.reqGuidanceForm.date3 + this.reqGuidanceForm.time3,

     
    }
  }
  reqNow() {
    this.checkReqGuidance()
  }







  selectService(service: string) {
    this.selectedService = service;
    this.isFormVisible = true;

  }
  // openLargeModal() {

  //   this.largeModal.nativeElement.classList.add('show');
  //   this.largeModal.nativeElement.style.display = 'block';
  // }
  // closeLargeModal() {
  //   this.largeModal.nativeElement.classList.remove('show');
  //   this.largeModal.nativeElement.style.display = 'none';
  // }






}
