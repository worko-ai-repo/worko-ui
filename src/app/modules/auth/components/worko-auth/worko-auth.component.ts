import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';
import {fetchUserAttributes, fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';



@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent  {

  registrationForm:any;
  userEmail:any;
  lastDashed:any;
  userId:any;
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
  this.getCandidateData()
 }
 async getCandidateDetails() {
  //debugger
  await this.candidateSrv.getUserDetails(this.userEmail).then(async (response) => {
    if (response) {
      this.lastDashed = response
      console.log(this.lastDashed[0].userType[0])
      if(this.lastDashed[0].userType[0]==='EMP'){
        this.storage.set("useremail", this.userEmail);
        console.log(this.userEmail);
        this.router.navigate(['/employee/Dashboard']);

      }else if(this.lastDashed[0].userType[0]==='CAND'){
        this.storage.set("useremail", this.userEmail);
        console.log(this.userEmail); 
        this.router.navigate(['/candidate/dashboard']);
      }
    }else{
      this.register()
      }
  });
}
async getCandidateData(){
 // debugger
  const {
    tokens,
   
    userSub
} = await fetchAuthSession();
console.log(tokens)
   this.userEmail=tokens?.idToken?.payload['email']?.toString();
   const {
    username,
    userId: id
  } = await getCurrentUser();
      this.userId=id
      console.log(id)
  await this.getCandidateDetails()
}


register() {
  debugger
  if (this.registrationType === 'candidate') {
    this.router.navigate(['/auth/candidatecompleteSignUp']);
} else if (this.registrationType === 'employee') {
  this.router.navigate(['/auth/employeecompleteSignUp']);
}


   


}
}

















