import { ChangeDetectorRef, Component } from '@angular/core';
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
  userDetails: any;
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService, private subscriptionPack: SubscriptionPackService, private spinner: NgxSpinnerService, private router: Router, private cdr: ChangeDetectorRef) { }
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

        // let activeSubscription: any = null;
        // response.forEach((subscription: any) => {
        //   if (subscription.status === "ACTIVE" && !activeSubscription) {
        //     activeSubscription = subscription;
        //   }
        // });

        // Filtering out all subscriptions which have status set to ACTIVE
        const activeSubscription = response.filter((subscription: any) => subscription.status === "ACTIVE");
        if (activeSubscription.length > 0) {
          //console.log("Current active subscription is: ", activeSubscription);
          this.packageDetails = activeSubscription;
          this.packageDetails1 = activeSubscription;
          this.cdr.detectChanges();
          // this.achievementsList = response[0].achievements;
        } else {
          //console.log("No active subscription found.");
        }
        this.getSubcriptionPack();
      }
    });
  }

  getSubcriptionPack() {
    this.subscriptionPack.getSubscription().subscribe({
      next: (response) => {
        // console.log(response);
        this.subscriptionList = response.sort((a: any, b: any) => a.amount - b.amount);
        // console.log(this.subscriptionList, "Hello")
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
        // debugger;
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
          this.userDetails = response;
        }
      })
    } catch (error: any) {
      if (error.status == 401) {
        this.storage.set('redirectAfterLogin','/candidate/subscription');
        this.router.navigate(['/']);
      }
    }
  }

}
