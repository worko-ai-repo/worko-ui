import { Component } from '@angular/core';

@Component({
  selector: 'app-acandidate',
  templateUrl: './acandidate.component.html',
  styleUrls: ['./acandidate.component.scss']
})
export class AcandidateComponent {

dateRangeOptions: any = [
  {
    name: "1 month",
    value: "0-30"
  },
  {
    name: "3 months",
    value: "0-90"
  },
  {
    name: "6 months",
    value: "0-180"
  },
  {
    name: "1 year",
    value: "0-365"
  },
  {
    name: "lifetime",
    value: "0-1000"
  }
]

profileStatusOptions: any =[
  {
    name: "Profile not completed",
    value: false
  },
  {
    name: "Profile Completed",
    value: true
  }
]

referralCountOptions: any = [
  {
    "name": "Awaiting referral request",
    "value": "awaiting"
  },
  {
    "name": "Ongoing referral request",
    "value": "Ongoing"
  },
  {
    "name": "Done referral request",
    "value": "Done"
  },
  {
    "name": "Disputed referral request",
    "value": "Disputed"
  }
]

onJoiningDateChange($event: Event) {
throw new Error('Method not implemented.');
}
  // Date Range / Lifetime	Date of Joining, Premium subscription, Free subscription, Awaiting referral request, Ongoing referral request, Done referal request, Disputed referral request , Awaiting service request, Ongoing service request, Done service request, Disputed service, request , 	Profile not completed, Profile completed, Current company , Total referral request, total service request			
  filterData: any = {
    dateRange: "",
    joinDate: "",
    subscriptionType: "",
    referralStatus: "",
    serviceRequest: "",
    profileStatus: "",
    currentCompany: "",
    totalServiceRequest: "",
    referralCount: ""
  }

  onProfileStatusChange($event: any) {
    throw new Error('Method not implemented.');
    }

  onReferralCountChange($event: any) {
    throw new Error('Method not implemented.');
    }
}
