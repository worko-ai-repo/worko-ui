import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent implements OnInit {
 certificationList:any[]=[];
 emailAddress:any="";
 certificationDetails:any={

 }

  constructor( private candidateSrv : CandidateProfileService , private storage : StorageService ){}

  ngOnInit(): void {
      this.emailAddress= this.storage.get("useremail")
      this.userCertifications();
  }

  userCertifications(){
    this.candidateSrv.getCandidateSkills(this.emailAddress).subscribe({
      next:(response)=>{
        this.certificationList=response;
      }
    })
  }


}
