import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';
import {fetchUserAttributes, fetchAuthSession} from 'aws-amplify/auth';



@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent  {


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private storage: StorageService,
    private route: ActivatedRoute,


  ) {
  
  }
  
 
  // code:any;
  //  oAuthTokenEndpoint ='https://' + 'worko.auth.ap-south-1.amazoncognito.com' + '/oauth2/token';
  //   _cognitoClientId='5evf019rrkaijtnjf2j1vvdf33'
   
  ngOnInit(): void {
   
   const usertype=this.storage.get('LinkedinUserType') ;
   console.log(usertype)
   if(usertype==='employeeSignUp'){
    this.employeeSignUp()
   }else if(usertype==='candidateSignUp'){
    this.candidateSignUp()

   }else{
    this.signIn()
   }
  

 }

 employeeSignUp(){
  // const getUserAttributes = async ({ userAttributes}: { userAttributes: any }) => {
  //   // Note that return type has changed from array to object
  //   const attributes = await fetchUserAttributes();
  //   console.log(attributes)
  // }
  this.router.navigate(['/auth/employeecompleteSignUp']);
 }
 async candidateSignUp(){
  this.router.navigate(['/auth/candidatecompleteSignUp']);
 
 
   
    
    
  }

 signIn(){
  const getUserAttributes = async ({ }) => {
    // Note that return type has changed from array to object
    const attributes = await fetchUserAttributes();
    console.log(attributes)
  }
 }



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




}











