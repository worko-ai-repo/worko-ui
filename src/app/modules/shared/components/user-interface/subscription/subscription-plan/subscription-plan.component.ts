import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent {
  @Input() subscriptionList: any;
  filteredPackages: any;

  // constructor(private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }
  ngOnInit(): void {

    // this.emailAddress = this.storage.get("useremail");

  }

  ngOnChanges(): void {
    // console.log(this.subscriptionList);
    if (this.subscriptionList) {
       this.filteredPackages = this.subscriptionList.filter((pkg: any) => pkg.name !== "Free");

      // Sort the filtered packages by the desired order: Basic, Classic, Premium
      let sortedPackages =  this.filteredPackages.sort((a: any, b: any) => {
        const order: Record<string, number> = { "Basic": 1, "Classic": 2, "Premium": 3 };
        return order[a.name as keyof typeof order] - order[b.name as keyof typeof order];
      });

      this.filteredPackages = sortedPackages.slice(0, 3);

      // console.log( this.filteredPackages);
    }
  }
}
