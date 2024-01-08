import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";
  recentGraduation: any;
  constructor(private candidateSrv: CandidateProfileService, private Storage: StorageService) { }

  ngOnInit(): void {
    console.log('Education Details:', this.educationDetails);

//     if (this.educationDetails && Array.isArray(this.educationDetails)) {
//       this.recentGraduation = this.educationDetails.reduce((acc: any, current: any) => {
//         return current.passingYear > acc.passingYear ? current : acc;
//       }, { passingYear: 0 });
//       console.log('Recent Graduation:', this.recentGraduation);
//     } else {
//       console.log('Education Details is not an array or is null/undefined.');
//     }
}
}