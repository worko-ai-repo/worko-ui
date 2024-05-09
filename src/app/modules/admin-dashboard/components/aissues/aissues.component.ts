import { Component } from '@angular/core';
import { AissuesService } from '../../services/aissues.service';

@Component({
  selector: 'app-aissues',
  templateUrl: './aissues.component.html',
  styleUrls: ['./aissues.component.scss']
})
export class AissuesComponent {

  constructor(private aissuesService: AissuesService){}
  async ngOnInit(): Promise<void> {
    this.getAllIssues();
  }

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
  
  issuesStatusOptions: any =[
    {
      name: "Open",
      value: "Open"
    },
    {
      name: "In Progress",
      value: "In Progress"
    },
    {
      name: "Resolved",
      value: "Resolved"
    }
  ]
  
  issueTypeOptions: any = [
    {
      "name": "Referral",
      "value": "Referral"
    },
    {
      "name": "Subscription",
      "value": "Subscription"
    },
  ]
  
  filterData: any = {
    dateRange: "",
    joinDate: "",
    subscriptionType: "",
    referralStatus: "",
    serviceRequest: "",
    issuesStatus: "",
    currentCompany: "",
    totalServiceRequest: "",
    issueType: ""
  }

  ondateRangeChange($event: Event) {
    throw new Error('Method not implemented.');
  }
    
  onissuesStatusChange($event: any) {
    throw new Error('Method not implemented.');
    }

  onissueTypeChange($event: any) {
    throw new Error('Method not implemented.');
    }

    async getAllIssues(){
      await this.aissuesService.getAllIssues().then(async (response: any) => {
        if (response) {
          console.log("Response from Issues API");
        }
      })
    }

    // async getCompanyDetails() {
    //   if (this.lastKey || this.loadedOnce) {
    //     this.spinner.show();
    //     await this.companyListing.getCompanyListing(this.pageSize, this.lastKey, this.filterData.teamSize, this.filterData.industryType, this.filterData.companyName).then(async (response) => {
    //       if (response) {
    //         console.log("Helo11");
    //         this.spinner.hide();
    //         if (this.loadedOnce) {
    //           this.companyList = [];
    //         }
    //         this.companyList = this.companyList.concat(response.data);
    //         this.lastKey = response.pagination.lastKey;
    //         this.loadedOnce = false;
  
    //         //  this.filterCompanies(); // Filter companies after updating companyList
    //       }
    //     })
    //       .catch(error => {
    //         console.error('Display Company Listing Error:', error);
    //         this.spinner.hide();
    //       });
    //   }
    // }
}
