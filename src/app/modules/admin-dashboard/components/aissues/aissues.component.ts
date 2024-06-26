import { Component } from '@angular/core';
import { AissuesService } from '../../services/aissues.service';

@Component({
  selector: 'app-aissues',
  templateUrl: './aissues.component.html',
  styleUrls: ['./aissues.component.scss']
})
export class AissuesComponent {
issueClick($event: MouseEvent,issue: number) {

}
  issueList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;

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
      value: "OPEN"
    },
    {
      name: "In Progress",
      value: "IN_PROGRESS"
    },
    {
      name: "Resolved",
      value: "RESOLVED"
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
    
  async onissuesStatusChange(selectedIssueStatus: string) {
    this.filterData.issuesStatus = selectedIssueStatus;
    await this.getAllIssues();
    }

  onissueTypeChange($event: any) {
    throw new Error('Method not implemented.');
    }

    async getAllIssues(){
      await this.aissuesService.getAllIssues(this.filterData.issuesStatus).then(async (response: any) => {
        if (response) {
          this.issueList = response;
        
        }
      })
    }

    getCurrentPageIssues(): any[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.issueList.slice(startIndex, endIndex);
    }
  
}
