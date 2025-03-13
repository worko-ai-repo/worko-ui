import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';

import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { DataTextureLoader } from 'three';
import { fetchAuthSession, getCurrentUser, signOut } from '@aws-amplify/auth';
import { environment } from 'src/environments/environment';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';



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
  groupType: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private storage: StorageService,
    private route: ActivatedRoute,

    private candidateSrv: CandidateProfileService,
    private navbarToggleSwitchService: NavbarToggleSwitchService
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


            this.storage.set('accessToken', this.linkedinAccessToken?.toString());

            const usertype = this.storage.get('LinkedinUserType');

            if (usertype === 'employeeSignUp') {
              this.employeeSignUp()
            } else if (usertype === 'candidateSignUp') {
              this.candidateSignUp()

            }
            else {
              this.signIn()
            }


            break;
          case 'logout':
            await this.cognitoService.handleSignOut();
            // this.router.navigate(['/']);
            const baseUrl = window.location.origin;
            window.location.href = `${baseUrl}/`;
            // window.location.href = environment.crossOriginUrl + '/';
            break;
        }
      })
      .unsubscribe();

  }


  async employeeSignUp() { //check whether the user is already persent or not 
    //this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {

      this.router.navigate(['/auth/employeecompleteSignUp']);
    }
  }
  async candidateSignUp() { // check whether the user is already persent or not 

    // this.getCandidateData()
    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {

      this.router.navigate(['/auth/candidatecompleteSignUp']);
    }


  }


  //if user is not registered and clicking on sign in with linkedin
  async signIn() {
    // this.getCandidateData()

    const isCandidatePresent = await this.getCandidateDetails();
    if (isCandidatePresent) {
      this.registerOptionScreen = true;
      this.register();
    }
  }
  //check whether user is sign in or not.
  async getCandidateDetails() {
    try {
      // Fetch the authentication session
      const { tokens, userSub } = await fetchAuthSession();


      this.userEmail = tokens?.idToken?.payload['email']?.toString().toLowerCase();
      this.userName = tokens?.idToken?.payload['given_name']?.toString();

      this.groupType = tokens?.idToken?.payload['cognito:groups']

      if (Array.isArray(this.groupType) && this.groupType.includes('admin')) {
        this.storage.set('userType', 'Admin');
      }

      // Fetch the current user details
      const { username, userId: id } = await getCurrentUser();
      this.userId = id;
      this.storage.set('userName', this.userName);


      // Fetch the user details from the candidate service
      const response = await this.candidateSrv.getUserDetails(this.userEmail);
      if (response) {
        this.lastDashed = response;
        this.registerOptionScreen = false;
        this.storage.set("isLinkedinUser", 'true');

        this.userType = response[0].lastAccessedDash;
        let userName = response[0].name;
        this.storage.set('lastAccessedDash', this.userType);   //functionality to navigate to the lastAccessed dashboard
        this.storage.set('userName', userName);
        this.navbarToggleSwitchService.intializeToggleStatus();

        // this.userType = this.lastDashed[0].userType[0];
        this.storage.set("useremail", this.userEmail);

        // Check if the current route is /company-listing
        const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
        if (isCompanyListingRoute) {
          this.userName = this.storage.get('userName');

          this.storage.set("useremail", this.userEmail);

          this.letter = this.userName.charAt(0).toUpperCase();

          // // Redirect to the company listing page
          // this.router.navigate(['/companies']);

          //redirect to dynamic routes
          const dynamicRoutes = this.storage.get('dynamicRoute')
          let decodedRoute = decodeURIComponent(dynamicRoutes); // Decode the route

          // Check if applyJob was set before login
          const applyJob = this.storage.get('applyJobAfterLogin'); // Retrieve flag
          if (applyJob) {
            this.storage.remove('applyJobAfterLogin'); // Clearing it after using

            // Append applyJob=true properly
            const url = new URL(decodedRoute, window.location.origin); // Creating the URL object
            url.searchParams.set('applyJob', 'true'); // Adding the query param

            decodedRoute = url.pathname + url.search; // Getting clean path with params
          }

          // Navigate to the dynamic route with query param if applicable
          this.router.navigateByUrl(decodedRoute);

          return false;
        } else if (this.groupType.includes('admin')) {
          this.router.navigate(['/switcher']);
          return false;
        } else {
          // Fetch the profile completion percentage
          const percentageresponse = await this.candidateSrv.getProfileComplete(this.userEmail);
          if (percentageresponse) {
            this.profileCompletion = percentageresponse;


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
        }

      } else {
        return true;
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

    this.userEmail = tokens?.idToken?.payload['email']?.toString();
    const {
      username,
      userId: id
    } = await getCurrentUser();
    this.userId = id

    await this.getCandidateDetails()
  }

  //user will be shown a selection form for candidate and employee when non register user click on sign in with linkedin
  register() {
    if (this.registrationType === 'candidate') { // if user select candidate
      this.router.navigate(['/auth/candidatecompleteSignUp']);
    } else if (this.registrationType === 'employee') { // if user select employee
      this.router.navigate(['/auth/employeecompleteSignUp']);
    }





  }



}
