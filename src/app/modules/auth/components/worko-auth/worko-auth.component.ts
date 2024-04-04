import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Hub } from 'aws-amplify/utils';
import 'aws-amplify/auth/enable-oauth-listener';
// import {  getCurrentUser, AuthUser} from 'aws-amplify/auth';
import { signInWithRedirect,fetchAuthSession, SignInOutput, getCurrentUser, signIn, type SignInInput, signOut, signUp, confirmSignUp, type ConfirmSignUpInput, AuthError } from 'aws-amplify/auth';

@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent  {

  accessToken:any;
 
  // Payload = {
  //   event: ""
    
  // };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private storage: StorageService,
    private route: ActivatedRoute,


  ) {

  }
  
 
  code:any;
   oAuthTokenEndpoint ='https://' + 'worko.auth.ap-south-1.amazoncognito.com' + '/oauth2/token';
    _cognitoClientId='5evf019rrkaijtnjf2j1vvdf33'
   
  ngOnInit(): void {
    
    //this.currentSession();
    this.route.queryParams.subscribe(async params => {
     this.code = params['code'];
      console.log('Code:', this.code);
      
      // debugger
      // Hub.listen("auth", async ({ payload }) => {
      //   switch (payload.event) {
      //     case "signInWithRedirect":
      //       const user = await getCurrentUser();
      //       console.log(user.username);
      //       break;
      //     case "signInWithRedirect_failure":
      //       // handle sign in failure
      //       break;
      //     case "customOAuthState":
      //       const state = payload.data; // this will be customState provided on signInWithRedirect function
      //       console.log(state);
      //       break;
      //   }
      //   });
      
    });
    // debugger
  
    // const data="hi"
    // const listener = (data: any) => {
    //   console.log(data);
    // };
    
    // Hub.listen('auth', listener =>{
    //   if(data==='hi'){
    //     console.log("hi")
    //   }
    // });
    
  // this.checkRedirection();

 }


//   async linkdinlogin(){
   
//   Hub.listen("auth", async ({ payload }) => {
//     switch (payload.event) {
//       case "signInWithRedirect":
//         const user = await getCurrentUser();
//         console.log(user.username);
//         break;
//       case "signInWithRedirect_failure":
//         // handle sign in failure
//         break;
//       case "customOAuthState":
//         const state = payload.data; // this will be customState provided on signInWithRedirect function
//         console.log(state);
//         break;
//     }
//     });
// }


  /**
 * Logout.
 *
 * @returns {Promise<void>}
 */

  // async logout(): Promise<void> {
  //   try {
  //    // await this.cognitoService.handleSignOut();
  //     // After successful logout, navigate to the landing page route
  //     // this.router.navigate(['/']);
  //     // var cognitoLogoutUrl = ;
  //   // Redirect to home page after logout
  //   // var homePageUrl = '/';
  //   // Navigate to home page after logout
  //  // window.location.href = 'http://localhost:4200/auth/logout&redirect_uri=http://localhost:4200/'
    
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  constructLogoutURL(clientId: string, logoutUri: string): string {
    
    const cognitoLogoutEndpoint = 'http://worko.auth.ap-south-1.amazoncognito.com/logout';
    const encodedLogoutUri = encodeURIComponent(logoutUri);
    const logoutURL = `${cognitoLogoutEndpoint}?client_id=${clientId}&logout_uri=${encodedLogoutUri}`;
    return logoutURL;
}
  async  performLogout() {
    const logoutUri='http://localhost:4200/'
    const logoutURL = this.constructLogoutURL(this._cognitoClientId, logoutUri);
    
    try {
      const response = await fetch(logoutURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // adjust headers as needed
            // add any other headers if required
        },
        // add any other fetch options if required
    });

    if (response.ok) {
        console.log('Logout successful');
        // Redirect the user to the logoutUri or handle the response accordingly
    } else {
        console.error('Logout failed:', response.statusText);
        // Handle error response
    }
} catch (error) {
    console.error('Error during logout:', error);
    // Handle network errors or other exceptions
}
}  
 
 




  
  async checkRedirection(){
    console.log("Hello");
   
  //await  this.handleCodeFlow();
 // this.performLogout()
 //this.onAuthEvent(JSON.parse(this._cognitoClientId))
   
    alert("Check")
  }




	
  private async handleCodeFlow() {
    const oAuthTokenEndpoint = `https://worko.auth.ap-south-1.amazoncognito.com/oauth2/token`;
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code:this.code,
        client_id: this._cognitoClientId ,
       
        redirect_uri:'http://localhost:4200/auth/checkRedirection' 
        
       
      });

const response = await fetch(oAuthTokenEndpoint, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  body: body
});

const responseData = await response.json();
if (response.ok) {
  const { access_token, refresh_token, id_token } = responseData;
  //this.storage.set('accessToken', this.accessToken);
  this.accessToken=await this.storage.set('accessToken', access_token)
  console.log(this.accessToken)

  // this.fetchLinkedinData();
  this.router.navigate(['/auth/fetch-data']);
  return {
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token,
     
     
  };
 
  
} else {
  throw new Error(responseData.error);
}

 
}
async fetchLinkedinData() {
// const   accessToken= this.cognitoService.getAccessToken();
//   this.cognitoService.getUserData(accessToken)
//   //this.linkedinService.getUserData(accessToken)
//     .then(response => {
//       // Handle successful response
//       console.log('LinkedIn User Data:', response.data);
//     })
//     .catch(error => {
//       // Handle error
//       console.error('Error fetching LinkedIn user data:', error.response.data);
//     });
 
//create-user
//this.logout()


}


}











