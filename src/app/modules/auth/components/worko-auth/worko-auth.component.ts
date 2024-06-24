import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';

import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { DataTextureLoader } from 'three';
import { fetchAuthSession, getCurrentUser, signOut } from '@aws-amplify/auth';
import { environment } from 'src/environments/environment';



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
  profileCompletion: any;
  userType: any;
  userName: any;
  letter: any;
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
            await this.cognitoService.handleSignOut();
            // this.router.navigate(['/']);
            window.location.href = environment.crossOriginUrl + '/';
            break;
        }
      })
      .unsubscribe();

  }


  async employeeSignUp() { //check whether the user is already persent or not 
    //this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      console.log("Candidate not present");
      this.router.navigate(['/auth/employeecompleteSignUp']);
    }
  }
  async candidateSignUp() { // check whether the user is already persent or not 

    // this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      console.log("Candidate not present");
      this.router.navigate(['/auth/candidatecompleteSignUp']);
    }


  }



  async signIn() {
    // this.getCandidateData()
    //check whether user is sign in or not.
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      this.registerOptionScreen = true;
      this.register();
    }
  }
  async getCandidateDetails() {
    
    try {
      // Fetch the authentication session
      const { tokens, userSub } = await fetchAuthSession();
      console.log(tokens);

      this.userEmail = tokens?.idToken?.payload['email']?.toString();
      this.userName=tokens?.idToken?.payload['given_name']?.toString();

      // Fetch the current user details
      const { username, userId: id } = await getCurrentUser();
      this.userId = id;
      this.storage.set('userName',this.userName);
      console.log(id);
      // Check if the current route is /company-listing
      const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
      if (isCompanyListingRoute) {
        this.userName = this.storage.get('userName');
        console.log(this.userName);
        this.storage.set("useremail", this.userEmail);

        this.letter = this.userName.charAt(0).toUpperCase();

        // Redirect to the company listing page
        this.router.navigate(['/company-listing']);
        return false;
      }
      else {
        // Fetch the user details from the candidate service
        const response = await this.candidateSrv.getUserDetails(this.userEmail);
        if (response) {
          this.lastDashed = response;
          this.registerOptionScreen = false;


          this.userType = this.lastDashed[0].userType[0];
          this.storage.set("useremail", this.userEmail);

          // Fetch the profile completion percentage
          const percentageresponse = await this.candidateSrv.getProfileComplete(this.userEmail);
          if (percentageresponse) {
            this.profileCompletion = percentageresponse;
            console.log(this.profileCompletion);

            if (this.profileCompletion) {
              const profileType = this.userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
              const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);

              // Navigate based on the profile completion percentage
              if (this.userType === "CAND" && totalPercentage >= 60) {
                this.router.navigate(['/candidate/dashboard']);
              } else if (this.userType === "CAND" && totalPercentage < 60) {
                this.router.navigate(['/candidate/edit-profile']);
              } else if (this.userType !== "CAND" && totalPercentage >= 60) {
                this.router.navigate(['/employee/Dashboard']);
              } else if (this.userType !== "CAND" && totalPercentage < 60) {
                this.router.navigate(['/employee/Edit-profile']);
              }
            }
          }
          return false;

        } else {
          return true;
        }
      }
    } catch (error) {
      console.error(error);
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
