import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-complete',
  templateUrl: './user-profile-complete.component.html',
  styleUrls: ['./user-profile-complete.component.scss']
})
export class UserProfileCompleteComponent implements OnInit {
  @Input() candidateSocial: any = "";
  @Input() userType: string = "";
  // candidateLogos:any[]=[];
  // emailAddress: string = "";
  activeRoute: string = '';
  userLoggedIn: boolean = false;
  userRole: any;
  isEmployee: boolean = true; // You can initialize it to the appropriate value based on your logic
  
  /**
   * SidebarComponent constructor.
   *
   * @param {Router} router
   */
  constructor( private router : Router, private candidateSrv : CandidateProfileService , private Storage : StorageService){}

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    if (this.userType == "Candidate") {
      this.userRole = [
        {
          name: 'Edit',
          router: "/candidate/cedit-profile", 
         
        },
       
      ]
    }

    if (this.userType == "Employee") {
      this.userRole = [
        {
          name: 'Edit',
          router: "/employee/eEdit-profile"
        },
       
      ]
    }
  }
  // user():void {
  //   if(this.userRole =='Employee'){
  //     this.router.navigateByUrl('/employee/eEdit-profile')

  //   } else{
  //     this.router.navigateByUrl('/candidate/cEdit-profile')
  //   }
  // }


}
