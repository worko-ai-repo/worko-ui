import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';

import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { DataTextureLoader } from 'three';
import { fetchAuthSession, getCurrentUser, signOut } from '@aws-amplify/auth';



@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent {

  registerOptionScreen: boolean = false;
  registrationForm: any;
  userEmail: any;
  lastDashed: any;
  userId: any;
  registrationType: string = '';
  errorMessage: string = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private storage: StorageService,
    private route: ActivatedRoute,

    private candidateSrv: CandidateProfileService,
  ) {

  }

  linkedinAccessToken: any = ''
  // code:any;
  //  oAuthTokenEndpoint ='https://' + 'worko.auth.ap-south-1.amazoncognito.com' + '/oauth2/token';
  //   _cognitoClientId='5evf019rrkaijtnjf2j1vvdf33'

  async ngOnInit(): Promise<void> {
    this.executeProperAction()



  }

  executeProperAction() {
    this.activatedRoute.data
      .subscribe(async data => {
        switch (data['action']) {
          case 'checkRedirection':
            const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};

            this.linkedinAccessToken = accessToken;


            this.storage.set('accessToken', this.linkedinAccessToken.toString());

            const usertype = this.storage.get('LinkedinUserType');
            console.log(usertype)
            if (usertype === 'employeeSignUp') {
              this.employeeSignUp()
            } else if (usertype === 'candidateSignUp') {
              this.candidateSignUp()

            } else {
              this.signIn()
            }


            break;
          case 'logout':
           await  this.cognitoService.handleSignOut();
            this.router.navigate(['/']);
            break;
        }
      })
      .unsubscribe();

  }


  async employeeSignUp() {
    //this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      console.log("Candidate not present");
      this.router.navigate(['/auth/employeecompleteSignUp']);
    }
  }
  async candidateSignUp() {

    // this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      console.log("Candidate not present");
      this.router.navigate(['/auth/candidatecompleteSignUp']);
    }


  }



  async signIn() {
    // this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      this.registerOptionScreen = true;
      this.register();
    }
  }
  async getCandidateDetails() {

    const {
      tokens,

      userSub
    } = await fetchAuthSession();
    console.log(tokens)
    this.userEmail = tokens?.idToken?.payload['email']?.toString();
    const {
      username,
      userId: id
    } = await getCurrentUser();
    this.userId = id
    console.log(id)
    try {
      return await this.candidateSrv.getUserDetails(this.userEmail).then(async (response) => {
        if (response) {
          this.registerOptionScreen = false;
          this.lastDashed = response
          console.log(this.lastDashed[0].userType[0])
          if (this.lastDashed[0].userType[0] === 'EMP') {
            this.storage.set("useremail", this.userEmail);
            console.log(this.userEmail);
            this.router.navigate(['/employee/Dashboard']);

          } else if (this.lastDashed[0].userType[0] === 'CAND') {
            this.storage.set("useremail", this.userEmail);
            console.log(this.userEmail);
            this.router.navigate(['/candidate/dashboard']);
          }
          return false
        } else {
          return true;
        }
      });
    } catch {
      return true;
    }
  }
  async getCandidateData() {
    // debugger
    const {
      tokens,

      userSub
    } = await fetchAuthSession();
    console.log(tokens)
    this.userEmail = tokens?.idToken?.payload['email']?.toString();
    const {
      username,
      userId: id
    } = await getCurrentUser();
    this.userId = id
    console.log(id)
    await this.getCandidateDetails()
  }


  register() {
    if (this.registrationType === 'candidate') {
      this.router.navigate(['/auth/candidatecompleteSignUp']);
    } else if (this.registrationType === 'employee') {
      this.router.navigate(['/auth/employeecompleteSignUp']);
    }





  }
}
