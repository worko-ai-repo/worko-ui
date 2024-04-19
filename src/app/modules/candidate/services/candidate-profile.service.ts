import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../worko/services/auth.service';



const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {

/** 
  @param {HttpClient} http
  */
  constructor(private http : HttpClient , private authService: AuthService) { }

  /**
    @returns {Promise<any>}
   */
    getUserProfile(emailAddress:string):Promise<any>{
     return this.http.get(`${API_URL}user/${emailAddress}/socialprofile`,this.authService.getHttpOptions()).toPromise();
}
  getUserDetails(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/details`,this.authService.getHttpOptions()).toPromise();
  }

  getUserDetailsById(userId:string): Promise<any> {
    return this.http.get(`${API_URL}user/${userId}/detail`,this.authService.getHttpOptions()).toPromise();
  }

  getCandidateSkills(emailAddress:string):Promise<any>{
    return this.http.get(`${API_URL}user/${emailAddress}/skill`, this.authService.getHttpOptions()).toPromise();
  }
  getCandidateAchievements(emailAddress:string):Promise<any>{
    return this.http.get(`${API_URL}user/${emailAddress}/achievement`, this.authService.getHttpOptions()).toPromise();
  }
  getCandidateEducation(emailAddress:string){
    return this.http.get(`${API_URL}user/${emailAddress}/education`, this.authService.getHttpOptions()).toPromise();
  }

  getWorkExperience(emailAddress:string){
    return this.http.get(`${API_URL}user/${emailAddress}/experience`, this.authService.getHttpOptions()).toPromise();
  }


  getServices(emailAddress:string, status: string){
    return this.http.get(`${API_URL}user/${emailAddress}/service?status=${status}`, this.authService.getHttpOptions()).toPromise();
  }

  getProfileComplete(emailAddress:string):Promise<any>{
    return this.http.get(API_URL + `user/${emailAddress}/profilePercentage ` , this.authService.getHttpOptions()).toPromise();
  }

  /*************REferral APIS */

  getReferral(emailAddress:string, status: string){
    return this.http.get(`${API_URL}user/${emailAddress}/referral?status=${status}`, this.authService.getHttpOptions()).toPromise();
  }

  markasDoneReferral(emailAddress:string, status: string, referralId: string){
    return this.http.put(`${API_URL}user/${emailAddress}/referral/${referralId}/${status}`, {} , this.authService.getHttpOptions()).toPromise();
  }

  createReview(userId:string, data:any):Promise<any> {
    return this.http.post(API_URL + `user/${userId}/review`, data,this.authService.getHttpOptions() ).toPromise();
  }

  getReview(userId:string, referralId:any):Promise<any> {
    return this.http.get(`${API_URL}user/${userId}/review/received?referalId=${referralId}`, this.authService.getHttpOptions() ).toPromise();
  }

  raiseIssue(data:any):Promise<any> {
    return this.http.post(API_URL + `support/`, data,this.authService.getHttpOptions() ).toPromise();
  }

  withdrawReferral(emailAddress:string, status: string, referralId: string, data:any) {
    return this.http.put(`${API_URL}user/${emailAddress}/referral/${referralId}/${status}`, data,this.authService.getHttpOptions() ).toPromise();
  }

  /*************Services API */

  markasDoneService(emailAddress:string, status: string, serviceId: string){
    return this.http.patch(`${API_URL}user/${emailAddress}/service/${serviceId}/${status}`, {} , this.authService.getHttpOptions()).toPromise();
  }
  
  createEducation(emailAddress:string, data:any):Promise<any>{
    return this.http.post(API_URL + `user/${emailAddress}/education`, data,this.authService.getHttpOptions() ).toPromise();
  }
  createAchievments(emailAddress:string , data:any):Promise<any>{
    return this.http.post(API_URL + `user/${emailAddress}/achievement`, data, this.authService.getHttpOptions()).toPromise();
  }
  createUserProfile(emailAddress:string , data:any):Promise<any>{
    return this.http.post(API_URL + `user/${emailAddress}/socialprofile`, data, this.authService.getHttpOptions()).toPromise();
}

  createUserDetails(emailAddress:string , data:any): Promise<any> {
  return this.http.put(API_URL + `user/${emailAddress}/details`, data , this.authService.getHttpOptions()).toPromise();
}
  createUserSkills(emailAddress:string , data:any):Promise<any>{
    return this.http.post(API_URL + `user/${emailAddress}/skill`, data , this.authService.getHttpOptions()).toPromise();
  }

  createWorkExperience(emailAddress:string , data:any):Promise<any>{
    return this.http.post(API_URL + `user/${emailAddress}/experience`, data , this.authService.getHttpOptions()).toPromise();
  }

  getSubscription(emailAddress:string):Promise<any>{
    return this.http.get(API_URL + `user/${emailAddress}/subscription` , this.authService.getHttpOptions()).toPromise();
  }

  uploadProfilePic(documentDetails: any): Promise<any> {
    return this.http.post(API_URL + `file/gsu2u/USER_PROFILE_PIC`, documentDetails, this.authService.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }
  // createReferralRequest(emailId: string, data: any): Promise<any> {
  //   return this.http.post(API_URL + `user/${emailId}/referral/request`, data, this.authService.getHttpOptions()).toPromise();
  // }
 


  deleteUserCollege(emailAddress:string,sk:any):Promise<any>{
    return this.http.delete(API_URL+`user/${emailAddress}/education/${sk}`,this.authService.getHttpOptions()).toPromise();
  }
}





