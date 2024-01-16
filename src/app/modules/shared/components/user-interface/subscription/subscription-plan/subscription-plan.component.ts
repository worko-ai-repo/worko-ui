import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent {
  @Input() subscriptionList: any;

  // constructor(private router: Router, private candidateSrv: CandidateProfileService, private storage: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
   
    // this.emailAddress = this.storage.get("useremail");

  }

  ngOnChanges(): void {
    console.log(this.subscriptionList);
  }
}
