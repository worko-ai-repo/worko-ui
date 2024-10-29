import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-switcher',
  templateUrl: './account-switcher.component.html',
  styleUrls: ['./account-switcher.component.scss']
})
export class AccountSwitcherComponent {
  constructor(private router: Router){}

  handleAccountSelection(userType:any){
    if(userType==='admin'){
      this.router.navigate(['/admin/aCandidate']);
    }else{
      this.router.navigate(['/candidate/dashboard']);
    }
  }
}
