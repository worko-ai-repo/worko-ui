import { Component } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';


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
   const data= this.fetchUserData(this.accessToken)
   console.log(data)

 
  }



async  fetchUserData(accessToken: string): Promise<any> {
  try {
      const url = 'https://worko.auth.ap-south-1.amazoncognito.com/oauth2/userInfo'; 
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();
      return userData;
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
  }
}


}
