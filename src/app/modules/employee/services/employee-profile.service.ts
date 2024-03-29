import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../worko/services/auth.service';


const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

 /** 
  @param {HttpClient} http
  */
  constructor(private http : HttpClient , private authService: AuthService) { }

  getBankDetails(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/bankDetail`,this.authService.getHttpOptions()).toPromise();
  }

  createBankDetails(emailAddress:string, data: any): Promise<any> {
    return this.http.post(`${API_URL}user/${emailAddress}/bankDetail`,data,this.authService.getHttpOptions()).toPromise();
  }

  getEmployeeReferral(emailAddress:string, companySK: string, status: string): Promise<any> {
    return this.http.get(`${API_URL}referral/company/${companySK}?status=${status}`,this.authService.getHttpOptions()).toPromise();
  }

  updateReferralStatus(referralId:any, data:any) {
    return this.http.put(`${API_URL}referral/${referralId}/action`,data,this.authService.getHttpOptions()).toPromise(); 
  }

  getChooseAvailability(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/prashant@worko.ai/availability`,this.authService.getHttpOptions()).toPromise();
  }

}
