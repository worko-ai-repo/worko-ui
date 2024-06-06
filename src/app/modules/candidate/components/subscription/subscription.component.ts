import { Component } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { SubscriptionPackService } from 'src/app/modules/worko/services/subscription-pack.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  emailAddress: string = "";
  packageDetails: any;
  subscriptionList: any[] = [];
  packageDetails1: any;
  cardDetails: any[] = [];
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService, private subscriptionPack: SubscriptionPackService, private spinner: NgxSpinnerService, private router: Router) { }
  ngOnInit(): void {

    this.emailAddress = this.storage.get("useremail");
    if (this.emailAddress) {
      this.getCandidateDetails();
    }
    this.getSubscription();
  }

  async getSubscription() {
    this.spinner.show();
    await this.candidateSrv.getSubscription(this.emailAddress).then(async (response) => {
      if (response) {
        // Filtering out only that subscription which has isActive set to true

        let activeSubscription: any = null;
        response.forEach((subscription: any) => {
          if (subscription.status === "ACTIVE" && !activeSubscription) {
            activeSubscription = subscription;
          }
        });
        if (activeSubscription) {
          console.log("Current active subscription is: ", activeSubscription);
          this.packageDetails = activeSubscription;
          this.packageDetails1 = activeSubscription;
          // this.achievementsList = response[0].achievements;
        } else {
          console.log("No active subscription found.");
        }
        this.getSubcriptionPack();
      }
    })
  }

  getSubcriptionPack() {
    this.subscriptionPack.getSubscription().subscribe({
      next: (response) => {
        // console.log(response);
        this.subscriptionList = response;
        console.log(this.subscriptionList, "Hello")
        this.spinner.hide();
        // const filteredB = this.subscriptionList.filter(itemB => ! this.packageDetails1.some((itemA: any) => itemA.name === itemB.name));
        // const filteredB =  this.subscriptionList.filter(itemB => !this.packageDetails1.some((itemA: any) => itemA && itemA.name === itemB.name));
        // const filteredB = b.filter(itemB => !a.some(itemA => itemA.name === itemB.name));
        // const namesInA = new Set(this.subscriptionList.map((itemA: any) => itemA.name));
        // const filteredB = this.packageDetails.filter((itemB: any) => !namesInA.has(itemB.name));

        // console.log(filteredB);
        // console.log(filteredB);
      },
      error: (error) => {
        debugger;
        console.error(error);
        this.spinner.hide();
      },
      complete: () => {

      }
    });
  }

  async getCandidateDetails() {
    try {
      await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
        if (response) {
          this.storage.set('userId', response[0]?.id);
        }
      })
    } catch (error: any) {
      if (error.status == 401) {
        this.router.navigate(['/']);
      }
    }
  }

}
