import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import 'aws-amplify/auth/enable-oauth-listener';
import {fetchUserAttributes, fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { DataTextureLoader } from 'three';



@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent  {

  flag:any=0;
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

 async employeeSignUp(){
 
  const isCandidatePresent = await this.getCandidateDetails();
  if (isCandidatePresent) {
    console.log("Candidate not present");
    this.router.navigate(['/auth/employeecompleteSignUp']);
  }
 }
 async candidateSignUp(){
  
  
  const isCandidatePresent = await this.getCandidateDetails();
  if (isCandidatePresent) {
    console.log("Candidate not present");
    this.router.navigate(['/auth/candidatecompleteSignUp']);
  }
 
   
  }
 


 async signIn(){
  this.getCandidateData()
  const isCandidatePresent = await this.getCandidateDetails();
  if (isCandidatePresent) {
    this.flag = 1;
    this.register();
  }
 }
 async getCandidateDetails() {
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
  //debugger
  try{
  return await this.candidateSrv.getUserDetails(this.userEmail).then(async (response) => {
    if (response) {
      this.flag=0;
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
      return false
    }else{
      return true;
      // debugger
      // this.flag=1;
      // this.register()
      }
  });
}catch{
  // this.flag=1;
  //     this.register()
  return true;
}
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

















