import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-referral-request',
  templateUrl: './referral-request.component.html',
  styleUrls: ['./referral-request.component.scss']
})
export class ReferralRequestComponent  implements OnInit {
  @ViewChild('largeModal') largeModal!: ElementRef;
  showReferrelRow : boolean = true;
  divShow : boolean = true;
  showContent: boolean = true;


  subscriptionArray:any[]=[
    {"packageName":"Basic","packageRupees":199,"packageDuration":"3 referral / Month" },
    {"packageName":"Classic","packageRupees":499,"packageDuration":"10 referral / Month" },
    {"packageName":"Premium","packageRupees":499,"packageDuration":"25 referral / Month" },
    
  ];

  subscriptionObj:any={
    packageName:'',
    packageRupees:'',
    packageDuration:'',


  }
  ngOnInit(): void {
    setTimeout(() => {
      this.divShow = true;
    }, 5000);
  }





  toggleReferralInRow() {
    this.showReferrelRow = false;
  }
  hideDiv(){
    this.divShow=false;
  }
  // toggleSignUpRow() {
  //   this.showReferrelRow = true;
  // }
  openLargeModal() {
    // Using nativeElement to access the underlying HTML element
    this.largeModal.nativeElement.classList.add('show');
    this.largeModal.nativeElement.style.display = 'block';
  }

  closeLargeModal() {
    this.largeModal.nativeElement.classList.remove('show');
    this.largeModal.nativeElement.style.display = 'none';
  }
 

  
 
}

