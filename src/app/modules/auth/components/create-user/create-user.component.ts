import { Component } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';

import {GetCurrentUserOutput, fetchUserAttributes, getCurrentUser  } from 'aws-amplify/auth'


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  
 
  constructor(
  
    private cognitoService: CognitoService,
    private storage: StorageService,
     ) { }
    
   
     ngOnInit(): void {
      this.fetchLinkedindata()
     }

     accessToken:any=""; 
    
  async fetchLinkedindata(){
      this.accessToken= this.storage.get('accessToken')
    console.log(this.accessToken)
   this. checkUser()
   // currentUserInfo()
 
  }



// Function to get details about the currently authenticated user
async checkUser() {
 
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
    } catch (err) {
      console.log(err);
    }
}


// const currentUser = async () => {
//   try {
//     // check if user is authenticated
//     // try will throw if not
     
//     const user = await currentAuthenticatedUser();
//     // attributes are only updated here until re-auth
//     // so grab attributes from here
//     const attributes = await Auth.currentUserInfo();
//     const realuser = { ...user, ...{ attributes: attributes.attributes } };
//   }
// }
    
}
