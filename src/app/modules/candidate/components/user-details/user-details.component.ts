import { Component, OnInit, Input, HostListener } from '@angular/core';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";
  @Input() workExperienceDetails: any = "";

  candidateNameElement!: HTMLElement
  recentGraduation: any;
  profileImage: string = "/assets/public/candidate-img.png";
  constructor() { }

  ngOnInit(): void {


  }

// this code is to expand  and minimize the candidate name if it too long
  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement): void {
    const candidateNameElement = document.getElementById('candidateName');

    if (candidateNameElement && target === candidateNameElement) {
      this.toggleNameExpansion(candidateNameElement);
    }
  }

  toggleNameExpansion(element: HTMLElement): void {
    if (element.classList.contains('expanded')) {
      element.classList.remove('expanded');
      element.style.whiteSpace = 'nowrap';
      element.style.overflow = 'hidden';
      element.style.textOverflow = 'ellipsis';
    } else {
      element.classList.add('expanded');
      element.style.whiteSpace = 'normal';
      element.style.overflow = 'visible';
      element.style.textOverflow = 'clip';
    }
  }

  ngOnChanges(): void {
    // console.log(this.workExperienceDetails, "workExperienceDetails");

    if (this.workExperienceDetails?.length) {
      this.workExperienceDetails = this.workExperienceDetails[0];
    }
    this.profileImage = this.candidateDetails?.profileImageAwsS3SignedUrl ? this.candidateDetails?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'
  }





}


