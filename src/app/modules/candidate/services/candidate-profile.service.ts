import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { param } from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get(`${API_URL}user/${emailAddress}`,this.authService.getHttpOptions()).toPromise();
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
  getReferral(emailAddress:string){
    return this.http.get(`${API_URL}user/${emailAddress}/referral`, this.authService.getHttpOptions()).toPromise();
  }
 
}
