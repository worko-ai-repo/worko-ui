import { Injectable } from '@angular/core';
import { BehaviorSubject, config } from 'rxjs';

import { Amplify } from 'aws-amplify';
import * as awsamplify from './../../../../amplify-config'
import { StorageService } from '../app-core/services/storage.service';
import { NavbarToggleSwitchService } from '../candidate/services/navbar-toggle-switch.service';


import 'aws-amplify/auth/enable-oauth-listener';
import { AuthError, ConfirmSignUpInput, SignInInput, SignInOutput, confirmSignUp, fetchAuthSession, getCurrentUser, signIn, signInWithRedirect, signOut, signUp } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';






export interface IUser {
  email: string;
  password: string;
}

type SignUpParameters = {
  username: string;
  password: string;
  // email: string;
  phone_number: string;
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  linkedinAccessToken:any="";
  key:any='';
  value:any=""
  accessToken:any=""

  private authenticationSubject: BehaviorSubject<any>;
  
 

  constructor(private storage: StorageService, private navbarToggleSwitch:NavbarToggleSwitchService) {
    

Amplify.configure(awsamplify.config);
 

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
    Hub.listen("auth", async ({ payload }) => {
        switch (payload.event) {
          case "signInWithRedirect" :
            const user = await getCurrentUser();
            console.log("inside hub cognito service - signInWithRedirect");
            console.log(user);
            //await this.setAccessToken()
       
            //console.log()
            //return true;
          
            break;
          case "signInWithRedirect_failure":
            // handle sign in failure
           
            break;
          case "customOAuthState":
            const state = payload.data; // this will be customState provided on signInWithRedirect function
            console.log(state);
            break;
        }
      });
      
    
    
  }
 

//   async handleRedirectSignIn(){
//     const provider = {
//       custom: 'LinkedIn'
//     }
//  signInWithRedirect({provider})
//  this.login()

//   }



   handleSocialSignIn = () => {
    debugger
       const provider = {
      custom: 'LinkedIn'
    }

   const res= signInWithRedirect({provider}).then(()=>{
      Hub.dispatch('auth', { event: 'signInWithRedirect_success',data:res})
    });
 
}

//   //}
//    fetchAuthSessionOptions : any = {
//     redirectUri: 'http://localhost:4200/auth/checkRedirection',
//     clientId: '5evf019rrkaijtnjf2j1vvdf33',
//     responseType: 'token',
//     scope: 'openid',
//     state: 'state',
//     nonce: 'nonce',
//     codeVerifier: 'codeVerifier',
//     codeChallenge: 'codeChallenge',
//     codeChallengeMethod: 'codeChallengeMethod',
//     provider: 'custom',
//     customProvider: 'LinkedIn'
//   }
  

// async login(){
//  const authSession = await fetchAuthSession(this.fetchAuthSessionOptions);
//   console.log(authSession)
// }
  async handleSignIn(user: IUser): Promise<{ response?: SignInOutput; error?: AuthError }> {
    try {
      const login: SignInInput = {
        username: user.email,
        password: user.password
      };

      const authData = await signIn(login);
      this.authenticationSubject.next(true);
      await this.setAccessToken();

      return { response: authData };
    } catch (error) {
      console.error('Error signing in:', error);

      if (error instanceof AuthError) {
        return { error };
      }

      // If it's not an AuthError, handle it as needed
      throw error;
    }
  }

  async isLoggedIn() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
       console.log(`The username: ${username}`);
       console.log(`The userId: ${userId}`);

      if (signInDetails) {
        console.log('The signInDetails:', signInDetails);
   
        console.log(this.storage.get("useremail"), "Before")
        if(!this.storage.get("useremail")){
          this.storage.set("useremail", signInDetails.loginId);
        }
         console.log(this.storage.get("useremail"), "After")
        return true;
      } else {
        console.log('No signInDetails:');
        await this.handleSignOut();
        this.storage.remove("useremail");
        return false;
      }
    } catch (err) {
      console.error('Error fetching current authenticated user:', err);
      return false;
    }
  }


  async handleSignOut() {
    try {
      await signOut();
      this.storage.remove("useremail");
      this.storage.remove("LinkedinUserType");
      this.removeAccessToken();
      // this.removeEmployeeDashboardToggleStatus();
      // this.removeCurrentDashboardToggleStatus();
      localStorage.clear();
    // window.location.href = 'https://worko.auth.ap-south-1.amazoncognito.com/logout?client_id=5evf019rrkaijtnjf2j1vvdf33&logout_uri=http://localhost:4200/';
    


    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  async handleSignUp({
    username,
    password,
    phone_number,
    name
  }: SignUpParameters): Promise<{ response?: any; error?: AuthError }> {
    try {
      const signUpResponse = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            name,
            phone_number
          },
          autoSignIn: true
        }
      });

      // Return the entire response if sign-up is successful
      return { response: signUpResponse };

    } catch (error) {
      console.log('Error signing up:', error);
      if (error instanceof AuthError && error.message && (error.message.includes('Password did not conform with policy: Password not long enough') || error.message.includes('Invalid phone number format') || error.message.includes('An account with the given email already exists.'))) {
        return { error };
      } else {
        // Rethrow other errors to propagate them to the calling method
        throw error;
      }
    }
  }



  async handleSignUpConfirmation({
    username,
    confirmationCode
  }: ConfirmSignUpInput): Promise<{ response?: any; error?: any }> {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });

      // Return the response if confirmation is successful
      return { response: { isSignUpComplete, nextStep } };
    } catch (error) {
      console.log('error confirming sign up', error);

      // Return the error
      return { error };
    }
  }


  /**
   * Get access token.
   *
   * @returns {string}
   */
  getAccessToken(): string {
    for (let i = 0; i < localStorage.length; i++) {
      
      this.key = localStorage.key(i);
    if (this.key.startsWith('CognitoIdentityServiceProvider.') && this.key.includes('.accessToken')) {
         this.value = localStorage.getItem(this.key);
        //  console.log(this.value.toString())
        //  console.log(this.key)
        //  console.log(localStorage.getItem(this.key))
         this.accessToken=localStorage.getItem(this.key) || ''
         //this.storage.set('accessToken', this.value);
    }
  }
   return this.accessToken; 
  }

  /**
 * Store the "accessToken" of logged in user generated by Coginto (SSO).
 *
 * @returns {Promise<void>}
 */
  async setAccessToken(): Promise<boolean> {
    // const accessToken = await this.keycloakService.getToken();
    // const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    // const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    // console.log(idToken)
    //console.log(accessToken)
    // if (!accessToken) {
    //   this.storage.remove('accessToken');
    //   return false;
    // }
    for (let i = 0; i < localStorage.length; i++) {
      
      this.key = localStorage.key(i);
    if (this.key.startsWith('CognitoIdentityServiceProvider.') && this.key.includes('.accessToken')) {
         this.value = localStorage.getItem(this.key);
         //console.log(this.value.toString())
         this.storage.set('accessToken', this.value);
    }
  }

  //this.storage.set('accessToken', accessToken.toString());
    //console.log()
    return true;
  }

  /**
 * Remove access token.
 *
 * @returns {string}
 */
  removeAccessToken(): void {
    this.storage.remove('accessToken');
  }

  removeCurrentDashboardToggleStatus() {
    this.storage.remove("currentDashboardEnabled");
    // this.navbarToggleSwitch.toggleStatusFalse();
  }
  
}
